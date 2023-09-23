import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  const { id, role_name, role_color } = await req.json();

  const data = await query({
    query: "UPDATE roles SET role_name = ?, role_color = ? WHERE id = ?",
    values: [role_name, "#"+role_color, id],
  });

  return NextResponse.json({
    success: true,
    message: "Operation successful",
    data: [],
  });
}
