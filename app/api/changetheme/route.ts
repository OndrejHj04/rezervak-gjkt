import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { parse } from "url";

export async function POST(req: Request) {
  const URL = parse(req.url, true);
  const email = URL.query.email;
  const user = await query({
    query: `UPDATE users SET theme = "dark" WHERE email = ?`,
    values: [email],
  });

  return NextResponse.json({ users: user });
}
