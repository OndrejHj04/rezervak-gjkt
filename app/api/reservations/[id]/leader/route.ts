import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: any) {

  const data = await query({
    query: `SELECT leader FROM reservations WHERE id = ?`,
    values: [params.id]
  }) as any

  if (!data.length) {
    return NextResponse.json({ leader: null })
  }

  return NextResponse.json({ leader: data[0].leader })
}
