import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  const { full_name, email, theme } = await req.json();
  const checkUser = (await query({
    query: `SELECT * FROM users WHERE email = ?`,
    values: [email],
  })) as [];
  if (checkUser.length == 0) {
    const user = await query({
      query: `INSERT INTO users (id, full_name, email, theme) VALUES (NULL, ?, ?, ?)`,
      values: [full_name, email, theme],
    });
  }

  return NextResponse.json({ message: "success" });
}
