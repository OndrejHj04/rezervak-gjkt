import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await query({
    query: "SELECT username, password FROM users WHERE role = 'admin'",
    values: [],
  });

  return NextResponse.json({
    success: true,
    message: "Operation successful",
    data: data,
  });
}
