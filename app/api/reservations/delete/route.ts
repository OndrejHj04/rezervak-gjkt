import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("WELCOME");

    const { reservations } = await req.json();

    const getReservations = (await query({
      query: `SELECT * FROM reservations WHERE id IN (${reservations.join(
        ","
      )})`,
      values: [],
    })) as any;

    getReservations.forEach((reservation: any) => {
      console.log(reservation);
      reservation.groups = JSON.parse(reservation.groups);
      reservation.users = JSON.parse(reservation.users);
    });
    if (
      getReservations.some((reservation: any) => reservation.groups.length > 0)
    ) {
      const groupReservations = (await query({
        query: `SELECT id, reservations FROM ${"`groups`"} WHERE id IN (${getReservations
          .map((reservation: any) => reservation.groups)
          .flat()
          .join(",")})`,
        values: [],
      })) as any;

      groupReservations.map((group: any) => {
        let reservations = JSON.parse(group.reservations);
        reservations = reservations.filter(
          (reservation: any) => !reservations.includes(reservation)
        );
        query({
          query: `UPDATE ${"`groups`"} SET reservations = "${JSON.stringify(
            reservations
          )}" WHERE id = ${group.id}`,
          values: [],
        });
      });
    }

    if (
      getReservations.some(
        (reservation: any) => reservation.reservations.length > 0
      )
    ) {
      const usersReservations = (await query({
        query: `SELECT id, reservations FROM users WHERE id IN (${getReservations
          .map((reservation: any) => reservation.users)
          .flat()
          .join(",")})`,
        values: [],
      })) as any;

      usersReservations.map((user: any) => {
        let reservations = JSON.parse(user.reservations);
        reservations = reservations.filter(
          (reservation: any) => !reservations.includes(reservation)
        );
        query({
          query: `UPDATE users SET reservations = "${JSON.stringify(
            reservations
          )}" WHERE id = ${user.id}`,
          values: [],
        });
      });
    }

    const data = await query({
      query: `DELETE FROM reservations WHERE id IN (${reservations.join(",")})`,
      values: [],
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
        error: e,
      },
      { status: 500 }
    );
  }
}
