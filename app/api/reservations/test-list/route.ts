import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const reservations = (await query({
      query: `SELECT * FROM reservations`,
      values: [],
    })) as any;

    return NextResponse.json({
      success: true,
      message: "Something went wrong",
      data: reservations,
    });
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
      error: e,
    });
  }
}
