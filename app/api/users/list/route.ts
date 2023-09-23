import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const roles = url.searchParams.get("roles")?.split(",");
    const email = url.searchParams.get("email");
    const data = await query({
      query: `SELECT u.id, u.name, u.email, JSON_OBJECT('role_id', r.id, 'role_name', r.role_name, 'role_color', r.role_color) AS role FROM users u JOIN roles r ON u.role = r.id ${
        roles || email
          ? `${roles ? `WHERE r.id = ${roles}` : `WHERE u.email = "${email}"`}`
          : ""
      }`,
      values: [],
    });
    data.map((item) => (item.role = JSON.parse(item.role)));
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
