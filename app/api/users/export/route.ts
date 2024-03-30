import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const users = (await query({
      query: `SELECT users.id, CONCAT (first_name, ' ', last_name) as name, roles.name as role, email, verified, adress, birth_date, ID_code, active, theme
      FROM users 
      INNER JOIN roles ON roles.id = users.role
      `,
    })) as any;

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: users,
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
