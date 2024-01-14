import { query } from "@/lib/db";
import NewReservationMember from "@/templates/reservationUserEdit/template";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { user, reservations } = await req.json();

    await Promise.all([
      query({
        query: `DELETE FROM users_reservations WHERE userId = ? AND reservationId  IN(${reservations.map(
          () => "?"
        )})`,
        values: [user, ...reservations],
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: [],
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
