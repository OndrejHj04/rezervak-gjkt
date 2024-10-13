import { query } from "@/lib/db";
import { QueryResult } from "mysql2";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export interface User {
  id: number,
  first_name: string,
  last_name: string
}

interface Role {
  id: number,
  name: string
}

type Result = User & Role
export async function GET(request: NextRequest) {
  const user = await getServerSession()

  if (process.env.NODE_ENV !== "development" && user === null) {
    return new NextResponse(null, { status: 403 })
  }

  const page = Number(request.nextUrl.searchParams.get("page")) || 1
  const organization = Number(request.nextUrl.searchParams.get("organization")) || null
  const rpp = 10

  const res = await query({
    query: `
      SELECT u.id, u.first_name, u.last_name, u.email, u.image, u.verified, u.birth_date, u.ID_code,
      JSON_OBJECT('id', r.id, 'name', r.name) AS role,
      CASE WHEN o.id IS NULL THEN "null" ELSE JSON_OBJECT('id', o.id, 'name', o.name) END AS organization,
      CASE WHEN GROUP_CONCAT(ch.childrenId) IS NULL THEN "" ELSE GROUP_CONCAT(JSON_OBJECT('id', users.id, 'first_name', users.first_name, 'last_name', users.last_name, 'email', users.email) separator ';') END as children
      FROM users u
      INNER JOIN roles r ON r.id = u.role
      LEFT JOIN organization o ON o.id = u.organization
      LEFT JOIN children_accounts as ch ON ch.parentId = u.id
      LEFT JOIN users ON users.id = ch.childrenId
      ${!!organization && `WHERE o.id = ${organization}`}
      GROUP BY u.id
      LIMIT 10 OFFSET 0
      `,
    values: [((page - 1) * rpp)]
  }) as any

  console.log(res)
  const data = res.map((user: any) => ({
    ...user,
    role: JSON.parse(user.role),
    organization: JSON.parse(user.organization),
    children: user.children.split(";").reduce((a: any, b: any) => {
      b.length && a.push(JSON.parse(b))
      return a
    }, [])
  }))
  return NextResponse.json({ data })
}
