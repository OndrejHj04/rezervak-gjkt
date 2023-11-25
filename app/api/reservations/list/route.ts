import { query } from "@/lib/db";
import { Reservation } from "@/types";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    let sql = `SELECT * FROM reservations WHERE 1=1`;

    const reservations = (await query({
      query: sql,
      values: [],
    })) as any;

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: reservations,
    });
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
        error: e,
      },
      { status: 500 }
    );
  }
}
