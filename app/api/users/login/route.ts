import { query } from "@/lib/db";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const data = (await query({
      query: `SELECT * FROM users WHERE email = ? AND password = ?`,
      values: [email, password],
    })) as User[];
    
    const roles = (await query({
      query: `SELECT * FROM roles WHERE id = ?`,
      values: [data[0].role],
    })) as any;

    data.map((item) => (item.role = roles[0]));

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
