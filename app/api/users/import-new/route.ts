import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const users = await req.json();

    const data = (await query({
      query: `INSERT INTO users (first_name, last_name, email, role, password, verified, active) VALUES ${users.map(
        (user: any) =>
          `("${user.first_name}", "${user.last_name}", "${user.email}", "${
            user.role
          }", "${Math.random().toString(36).slice(-9)}", 0, 1)`
      )}`,
      values: [],
    })) as any;

    return NextResponse.json({
      success: true,
      message: `${data.affectedRows} uživatelů úspěšně importováno`,
      data: [],
    });
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        message: "Něco se nepovedlo",
      },
      { status: 500 }
    );
  }
}
