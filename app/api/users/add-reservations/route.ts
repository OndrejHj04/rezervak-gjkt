import { query } from "@/lib/db";
import NewReservationMember from "@/templates/reservationAddMember/template";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { user, newReservations, currentReservations } = await req.json();

    const [_, reservations] = (await Promise.all([
      await query({
        query: `UPDATE users SET reservations = "[${[
          ...currentReservations,
          ...newReservations.map((res: any) => res.id),
        ]}]" WHERE id = ${user.id}`,
        values: [],
      }),
      await query({
        query: `SELECT id, users, from_date, to_date, leader, instructions, users FROM reservations WHERE id IN (${newReservations
          .map((res: any) => res.id)
          .join(",")})`,
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
      await Promise.all([
        query({
          query: `UPDATE reservations SET users = "${JSON.stringify([
            ...JSON.parse(reservation.users),
            user.id,
          ])}" WHERE id = ${reservation.id}`,
          values: [],
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email`, {
          method: "POST",
          body: JSON.stringify({
            to: user.email,
            subject: "Nová rezervace",
            html: NewReservationMember(
              {
                ...reservation,
                leader: users.find(
                  (user: any) => user.id === reservation.leader
                ),
              },
              "add"
            ),
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
