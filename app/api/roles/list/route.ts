import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await query({
      query: `
      SELECT * FROM roles
    `,
      values: [],
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
