import { query } from "@/lib/db";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const data = (await query({
      query: `SELECT u.*, JSON_OBJECT('role_id', r.id, 'role_name', r.role_name, 'role_color', r.role_color) AS role FROM users u JOIN roles r ON u.role = r.id WHERE u.email = ? AND u.password = ?`,
      values: [email, password],
    })) as User[];

    data.map((item) => (item.role = JSON.parse(item.role as any)));

    if (data.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: data[0],
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
