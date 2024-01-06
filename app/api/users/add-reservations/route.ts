import { query } from "@/lib/db";
import NewReservationMember from "@/templates/reservationAddMember/template";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { user, newReservations, currentReservations } = await req.json();

    const getReservation = await query({
      query: `UPDATE users SET reservations = "[${[
        ...currentReservations,
        ...newReservations.map((res: any) => res.id),
      ]}]" WHERE id = ${user.id}`,
      values: [],
    });

    const reservations = (await query({
      query: `SELECT id, users FROM reservations WHERE id IN (${newReservations
        .map((res: any) => res.id)
        .join(",")})`,
      values: [],
    })) as any;
    reservations.forEach((reservation: any) => {
      reservation.users = JSON.parse(reservation.users);
    });

    reservations.map(async (reservation: any) => {
      await query({
        query: `UPDATE reservations SET users = "${JSON.stringify([
          ...reservation.users,
          user.id,
        ])}" WHERE id = ${reservation.id}`,
        values: [],
      });
    });
    newReservations.map(async (reservation: any) => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email`, {
        method: "POST",
        body: JSON.stringify({
          to: user.email,
          subject: "Nová rezervace",
          html: NewReservationMember(reservation, "add"),
        }),
      });
    });

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
