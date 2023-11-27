import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page"));
    const role = Number(url.searchParams.get("role"));
    const search = url.searchParams.get("search");

    let sql = `SELECT first_name, last_name, email, role, birth_date, verified, active FROM users WHERE 1=1`;
    let countSql = `SELECT COUNT(*) FROM users WHERE 1=1
    `;
    if (role) {
      sql += ` AND role = ${role}`;
      countSql += ` AND role = ${role}`;
    }

    if (search) {
      sql += ` AND first_name LIKE ${`"%${search}%"`} OR last_name LIKE ${`"%${search}%"`}`;
      countSql += ` AND first_name LIKE ${`"%${search}%"`} OR last_name LIKE ${`"%${search}%"`}`;
    }

    if (page) {
      sql += ` LIMIT 10 OFFSET ${page * 10 - 10}`;
    }

    const [roles, users, count] = (await Promise.all([
      query({
        query: "SELECT * FROM roles",
      }),
      query({
        query: sql,
        values: [],
      }),
      query({
        query: countSql,
        values: [],
      }),
    ])) as any;

    users.map((item: any) => {
      item.role = roles.find((r: any) => r.id === Number(item.role));
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: users,
      count: count[0]["COUNT(*)"],
    });
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
        error: e,
      },
      { status: 500 }
    );
  }
}
