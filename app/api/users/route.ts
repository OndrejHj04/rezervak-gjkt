import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  const user = await query({
    query: `SELECT * FROM users`,
    values: [],
  });

  return NextResponse.json({ users: user });
}
