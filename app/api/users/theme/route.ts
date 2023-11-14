import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { theme, id } = await req.json();

    const data = await query({
      query: `UPDATE users SET theme = ${!theme} WHERE id = "${id}"`,
      values: [],
    });

    return NextResponse.json({
      success: true,
      message: "Theme updated",
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
