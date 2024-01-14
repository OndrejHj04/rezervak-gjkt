import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page"));
    const role = Number(url.searchParams.get("role"));
    const search = url.searchParams.get("search");

    const [users, count] = (await Promise.all([
      query({
        query: `SELECT first_name, last_name, email, image, verified, birth_date, active, JSON_OBJECT('id', roles.id, 'name', roles.name) as role
          FROM users INNER JOIN roles ON roles.id = users.role WHERE 1=1
        ${search? `AND (users.first_name LIKE "%${search}%" OR users.last_name LIKE "%${search}%")`: ""}
        ${role ? `AND users.role = ${role}` : ""}
        ${page ? `LIMIT 10 OFFSET ${page * 10 - 10}` : ""}`,
        values: [],
      }),
      query({
        query: `SELECT COUNT(*) as total FROM users WHERE 1=1 
        ${search ? `AND (users.first_name LIKE "%${search}%" OR users.last_name LIKE "%${search}%")`: ""}
        ${role ? `AND users.role = ${role}` : ""}
        `,
        values: [],
      }),
    ])) as any;

    const data = users.map((user: any) => ({
      ...user,
      role: JSON.parse(user.role),
    }));

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data,
      count: count[0].total,
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
