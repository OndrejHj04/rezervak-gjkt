import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  const { name, password } = await req.json();

  const data = await query({
    query: "UPDATE users SET name = ?, password = ? WHERE role = 'admin'",
    values: [name, password],
  });

  return NextResponse.json({
    success: true,
    message: "Operation successful",
    data: data,
  });
}
