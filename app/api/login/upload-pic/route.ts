import { query } from "@/lib/db";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { picture, id } = await req.json();

  try {
    const data = await query({
      query: `UPDATE users SET image = ? WHERE id = ?`,
      values: [picture, id],
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
