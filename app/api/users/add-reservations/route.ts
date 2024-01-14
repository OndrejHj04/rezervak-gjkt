import { query } from "@/lib/db";
import NewReservationMember from "@/templates/reservationUserEdit/template";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { user, reservations } = await req.json();

    const values = reservations.flatMap((newReservation: any) => [
      user,
      newReservation,
      [user, newReservation].join(","),
    ]);

    const placeholders = reservations.map(() => "(?,?,?)").join(",");

    await Promise.all([
      query({
        query: `INSERT IGNORE INTO users_reservations (userId, reservationId, id) VALUES ${placeholders}`,
        values,
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
