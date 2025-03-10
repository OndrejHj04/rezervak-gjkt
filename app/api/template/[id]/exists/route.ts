import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: any) {

  const data = await query({
    query: `SELECT id FROM templates WHERE id = ?`,
    values: [params.id]
  }) as any

  if (!data.length) {
    return NextResponse.json({ exists: false })
  }

  return NextResponse.json({ exists: true })
}
