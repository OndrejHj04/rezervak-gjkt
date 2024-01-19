import { query } from "@/lib/db";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { password, id } = await req.json();

    const users = (await query({
      query: `UPDATE users SET password = MD5(?) WHERE id = ?`,
      values: [password, id],
    })) as any;

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      email: true,
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
