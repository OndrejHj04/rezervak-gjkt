import { query } from "@/lib/db";
import { User as NextAuthUser } from "next-auth";
import { NextResponse } from "next/server";

interface User extends NextAuthUser {
  full_name: string;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const roles = url.searchParams.get("roles")?.split(",");
    const email = url.searchParams.get("email");
    const data = (await query({
      query: `SELECT u.*, JSON_OBJECT('role_id', r.id, 'role_name', r.role_name, 'role_color', r.role_color) AS role FROM users u JOIN roles r ON u.role = r.id ${
        roles || email
          ? `${roles ? `WHERE r.id = ${roles}` : `WHERE u.email = "${email}"`}`
          : ""
      }`,
      values: [],
    })) as User[];
    data.map((item) => {
      item.role = JSON.parse(item.role as any);
      item.full_name = `${item.first_name} ${item.last_name}`;
      return item;
    });
    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: data,
    });
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
