import { NextResponse } from "next/server";
import { query } from "../../../lib/db";
import { User } from "../../../models/User";
export async function GET(req: Request) {
  try {
    const data = await query({
      query: "SELECT * FROM users",
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
