import { query } from "@/lib/db";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const users = (await query({
      query: `SELECT  id, email FROM users WHERE email = ?`,
      values: [email],
    })) as any;
    if (users.length) {
      console.log(
        sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            id: users[0].id,
          },
          "Kraljeliman"
        )
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Something went wrong",
          email: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      email: true,
      data: { email },
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
