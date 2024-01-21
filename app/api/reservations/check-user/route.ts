import { query } from "@/lib/db";
import protect from "@/lib/protect";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reservationId, userId } = await req.json();

    const isAuthorized = (await protect(
      req.headers.get("Authorization")
    )) as any;

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          message: "Auth failed",
        },
        { status: 500 }
      );
    }

    let result = {
      isMember: false,
      isLeader: false,
      exist: false,
      archived: false,
      forbidden: false,
    };

    const [reservation, users] = (await Promise.all([
      query({
        query: `SELECT leader, status FROM reservations WHERE id = ${reservationId}`,
        values: [],
      }),
      query({
        query: `SELECT * FROM users_reservations WHERE reservationId = ? AND userId = ?`,
        values: [reservationId, userId],
      }),
    ])) as any;

    if (reservation.length) {
      result.isMember = Boolean(users.length);
      result.isLeader = reservation[0].leader === userId;
      result.exist = true;
      result.archived = reservation[0].status === 1;
      result.forbidden = reservation[0].status === 5;
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
