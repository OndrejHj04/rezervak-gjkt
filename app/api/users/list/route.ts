import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const roles = url.searchParams.get("roles")?.split(",");
    const placeholders = roles?.map((role) => "?").join(", ") || 0;

    const data = await query({
      query: `SELECT * FROM users ${
        placeholders ? `WHERE role IN (${placeholders})` : ""
      }`,
      values: roles || [],
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
