import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id, active } = await req.json();

    const data = await query({
      query: `UPDATE users SET active = ${!active} WHERE id = "${id}"`,
      values: [],
    });

    return NextResponse.json({
      success: true,
      message: "Active status updated",
      active: !active,
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
