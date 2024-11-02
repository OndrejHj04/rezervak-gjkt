import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: any) {

  const data = await query({
    query: `SELECT g.id FROM groups g WHERE g.id = ?`,
    values: [params.id]
  }) as any

  return NextResponse.json({ exists: Boolean(data.length) })
}

