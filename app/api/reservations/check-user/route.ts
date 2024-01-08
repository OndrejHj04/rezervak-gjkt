import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reservationId, userId } = await req.json();

    let result = {
      isMember: false,
      isLeader: false,
      exist: false,
      archived: false,
    };

    const reservation = (await query({
      query: `
      SELECT leader, users, status FROM reservations WHERE id = ${reservationId}
      `,
      values: [],
    })) as any;

    if (reservation.length) {
      result.isMember = JSON.parse(reservation[0].users).includes(userId);
      result.isLeader = reservation[0].leader === userId;
      result.exist = true;
      result.archived = reservation[0].status === 1;
    }

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: result,
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
