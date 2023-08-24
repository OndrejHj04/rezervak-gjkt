import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST() {
  const user = await query({
    query: `UPDATE users SET theme = "light" WHERE email = ?`,
    values: ["email@email.com"],
  });

  return NextResponse.json({ users: user });
}
