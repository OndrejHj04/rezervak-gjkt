import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { group, removeReservaitons, currentReservations } = await req.json();

    const getGroups = await query({
      query: `UPDATE ${"`groups`"} SET reservations = "${JSON.stringify(
        currentReservations.filter(
          (reservation: any) => !removeReservaitons.includes(reservation)
        )
      )}" WHERE id = ${group}`,
      values: [],
    });

    const reservations = (await query({
      query: `SELECT * FROM reservations WHERE id IN (${removeReservaitons.join(
        ","
      )})`,
      values: [],
    })) as any;

    reservations.forEach((reservation: any) => {
      reservation.groups = JSON.parse(reservation.groups);
    });

    reservations.map(async (reservation: any) => {
      let newReservation = (reservation.groups = reservation.groups.filter(
        (res: any) => res !== group
      ));

      await query({
        query: `UPDATE reservations SET ${"`groups`"} = "${JSON.stringify(
          newReservation
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
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
