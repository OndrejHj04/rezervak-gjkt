import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: any) {

  const data = await query({
    query: `SELECT r.id FROM reservations r WHERE r.id = ? AND status <> 5`,
    values: [params.id]
  }) as any

  return NextResponse.json({ exists: data.length })

}
