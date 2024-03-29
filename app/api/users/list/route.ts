import { query } from "@/lib/db";
import protect from "@/lib/protect";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page"));
    const role = Number(url.searchParams.get("role"));
    const search = url.searchParams.get("search");
    const rpp = Number(url.searchParams.get("rpp")) || 10;

    const isAuthorized = (await protect(
      req.headers.get("Authorization")
    )) as any;

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          message: "Auth failed",
        },
        { status: 500 }
      );
    }

    const [users, count] = (await Promise.all([
      query({
        query: `SELECT users.id, first_name, last_name, email, image, verified, birth_date, active, JSON_OBJECT('id', roles.id, 'name', roles.name) as role
          FROM users INNER JOIN roles ON roles.id = users.role WHERE 1=1
        ${
          search
            ? `AND (users.first_name LIKE "%${search}%" OR users.last_name LIKE "%${search}%")`
            : ""
        }
        ${role ? `AND users.role = ${role}` : ""}
        ${page ? `LIMIT ${rpp} OFFSET ${page * rpp - rpp}` : ""}`,
        values: [],
      }),
      query({
        query: `SELECT COUNT(*) as total FROM users WHERE 1=1 
        ${
          search
            ? `AND (users.first_name LIKE "%${search}%" OR users.last_name LIKE "%${search}%")`
            : ""
        }
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
