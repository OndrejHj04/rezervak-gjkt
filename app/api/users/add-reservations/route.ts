import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { user, newReservations, currentReservations } = await req.json();

    const getReservation = await query({
      query: `UPDATE users SET reservations = "[${[
        ...currentReservations,
        ...newReservations,
      ]}]" WHERE id = ${user}`,
      values: [],
    });

    const reservations = (await query({
      query: `SELECT id, users FROM reservations WHERE id IN (${newReservations.join(
        ","
      )})`,
      values: [],
    })) as any;
    reservations.forEach((reservation: any) => {
        reservation.users = JSON.parse(reservation.users);
    });

    reservations.map(async (reservation: any) => {
      await query({
        query: `UPDATE reservations SET users = "${JSON.stringify([
          ...reservation.users,
          user,
        ])}" WHERE id = ${reservation.id}`,
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