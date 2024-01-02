import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reservationId, userId } = await req.json();

    const reservation = (await query({
      query: `
      SELECT leader, users FROM reservations WHERE id = ${reservationId}
      `,
      values: [],
    })) as any;
    const isMember = JSON.parse(reservation[0].users).includes(userId);
    const isLeader = reservation[0].leader === userId;

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: { isMember, isLeader },
    });
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
