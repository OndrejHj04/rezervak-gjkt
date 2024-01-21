import { query } from "@/lib/db";
import protect from "@/lib/protect";
import NewUserTemplate from "@/templates/userLogin/template";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { first_name, last_name, email, role } = await req.json();
    const password = Math.random().toString(36).slice(-9) as any;

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
    const check = (await query({
      query: `SELECT * FROM users WHERE email = ?`,
      values: [email],
    })) as any;

    if (check.length) {
      return NextResponse.json(
        {
          success: false,
          duplicate: true,
          message: "Something went wrong",
        },
        { status: 500 }
      );
    }
    const data = await query({
      query: `INSERT INTO users(first_name, last_name, email, role, password, verified, active) VALUES("${first_name}", "${last_name}", "${email}", ${role}, MD5("${password}"), 0, 1)`,
      values: [first_name, last_name, email, role, password],
    });
    return NextResponse.json({
      success: true,
      message: `Uživatel ${first_name} ${last_name} byl úspěšně vytvořen.`,
      data: [],
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
