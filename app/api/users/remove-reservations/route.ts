import { query } from "@/lib/db";
import NewReservationMember from "@/templates/reservationUserEdit/template";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { user, currentReservations, removeReservations } = await req.json();
    const [_, reservations] = (await Promise.all([
      await query({
        query: `UPDATE users SET reservations = "${JSON.stringify(
          currentReservations.filter(
            (reservation: any) => !removeReservations.includes(reservation)
          )
        )}" WHERE id = ${user.id}`,
        values: [],
      }),
      await query({
        query: `SELECT * FROM reservations WHERE id IN (${removeReservations.join(
          ","
        )})`,
        values: [],
      }),
    ])) as any;

    const users = (await query({
      query: `SELECT id, first_name, last_name FROM users WHERE id IN (${reservations
        .map((res: any) => res.leader)
        .join(",")})`,
      values: [],
    })) as any;

    reservations.map(async (reservation: any) => {
      reservation.users = JSON.parse(reservation.users);
      reservation.leader = users.find(
        (user: any) => user.id === reservation.leader
      );
      let newUsers = (reservation.users = reservation.users.filter(
        (res: any) => res !== user.id
      ));
      await Promise.all([
        query({
          query: `UPDATE reservations SET users = "${JSON.stringify(
            newUsers
          )}" WHERE id = ${reservation.id}`,
          values: [],
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email`, {
          method: "POST",
          body: JSON.stringify({
            to: user.email,
            subject: "Nová rezervace",
            html: NewReservationMember(reservation, "remove"),
          }),
        }),
      ]);
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
