import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const count = await query({
      query: `
                SELECT count FROM numbers WHERE id = 1
              `,
      values: [],
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: count,
    });
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: "Fail",
    });
  }
}
