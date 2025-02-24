import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request, {params}:any) {
  const { user } = await req.json();

  const data = await query({
    query: `SELECT r.id FROM reservations r
    LEFT JOIN users_reservations ur ON ur.reservationId = r.id
    WHERE r.id = ? AND status <> 5 AND (? != 3 OR r.leader = ? OR ur.userId = ?) `,
    values: [params.id, user.role.id, user.id, user.id]
  }) as any

  return NextResponse.json({ exists: data.length })

}
