import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const data = await query({
    query: "UPDATE users SET username = ?, password = ? WHERE role = 'admin'",
    values: [username, password],
  });

  return NextResponse.json({
    success: true,
    message: "Operation successful",
    data: data,
  });
}
