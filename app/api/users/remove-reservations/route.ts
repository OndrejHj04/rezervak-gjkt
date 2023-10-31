import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { user, currentReservations, removeReservations } = await req.json();

    const getUsers = await query({
      query: `UPDATE users SET reservations = "${JSON.stringify(
        currentReservations.filter(
          (reservation: any) => !removeReservations.includes(reservation)
        )
      )}" WHERE id = ${user}`,
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

    reservations.map(async (reservation: any) => {
      let newUsers = (reservation.users = reservation.users.filter(
        (res: any) => res !== user
      ));

      await query({
        query: `UPDATE reservations SET users = "${JSON.stringify(
          newUsers
        )}" WHERE id = ${reservation.id}`,
        values: [],
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
