import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: any) {

  const data = await query({
    query: `SELECT owner FROM groups WHERE id = ?`,
    values: [params.id]
  }) as any

  if (!data.length) {
    return NextResponse.json({ owner: null })
  }

  return NextResponse.json({ owner: data[0].owner })
}
