import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const roles = url.searchParams.get("roles")?.split(",");
    const email = url.searchParams.get("email");
    const data = await query({
      query: `SELECT * FROM users`,
      values: [],
    });
    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: data,
    });
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
      data: null,
    });
  }
}
