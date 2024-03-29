import { query } from "@/lib/db";
import protect from "@/lib/protect";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
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
    const users = (await query({
      query: `SELECT users.id, CONCAT (first_name, ' ', last_name) as name, roles.name as role, email, verified, adress, birth_date, ID_code, active, theme
      FROM users 
      INNER JOIN roles ON roles.id = users.role
      `,
    })) as any;

    const data = users;

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data,
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
