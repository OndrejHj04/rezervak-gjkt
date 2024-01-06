import { query } from "@/lib/db";
import NewReservationMember from "@/templates/reservationAddMember/template";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { user, currentReservations, removeReservations } = await req.json();

    const getUsers = await query({
      query: `UPDATE users SET reservations = "${JSON.stringify(
        currentReservations.filter(
          (reservation: any) => !removeReservations.includes(reservation)
        )
      )}" WHERE id = ${user.id}`,
      values: [],
    });

    const reservations = (await query({
      query: `SELECT * FROM reservations WHERE id IN (${removeReservations.join(
        ","
      )})`,
      values: [],
    })) as any;

    reservations.forEach((reservation: any) => {
      reservation.users = JSON.parse(reservation.users);
    });

    const users = (await query({
      query: `SELECT id, first_name, last_name FROM users WHERE id IN (${reservations
        .map((res: any) => res.leader)
        .join(",")})`,
      values: [],
    })) as any;

    reservations.map(async (reservation: any) => {
      let newUsers = (reservation.users = reservation.users.filter(
        (res: any) => res !== user.id
      ));

      reservation.leader = users.find(
        (user: any) => user.id === reservation.leader
      );
      await query({
        query: `UPDATE reservations SET users = "${JSON.stringify(
          newUsers
        )}" WHERE id = ${reservation.id}`,
        values: [],
      });
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email`, {
        method: "POST",
        body: JSON.stringify({
          to: user.email,
          subject: "Nová rezervace",
          html: NewReservationMember(reservation, "remove"),
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
