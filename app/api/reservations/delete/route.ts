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
    console.log("1");

    getReservations.forEach((reservation: any) => {
      reservation.groups = JSON.parse(reservation.groups);
      reservation.users = JSON.parse(reservation.users);
    });
    console.log(
      `SELECT id, reservations FROM ${"`groups`"} WHERE id IN (${getReservations
        .map((reservation: any) => reservation.groups)
        .flat()
        .join(",")})`
    );

    const groupReservations = (await query({
      query: `SELECT id, reservations FROM ${"`groups`"} WHERE id IN (${getReservations
        .map((reservation: any) => reservation.groups)
        .flat()
        .join(",")})`,
      values: [],
    })) as any;
    console.log("3");

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
    console.log("4");

    const usersReservations = (await query({
      query: `SELECT id, reservations FROM users WHERE id IN (${getReservations
        .map((reservation: any) => reservation.users)
        .flat()
        .join(",")})`,
      values: [],
    })) as any;

    console.log("5");
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
    console.log("6");

    const data = await query({
      query: `DELETE FROM reservations WHERE id IN (${reservations.join(",")})`,
      values: [],
    });
    console.log("7");

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
