import { query } from "@/lib/db";
import NewReservationMember from "@/templates/reservationUserEdit/template";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reservations } = await req.json();

    const getReservations = (await query({
      query: `SELECT * FROM reservations WHERE id IN (${reservations.join(
        ","
      )})`,
      values: [],
    })) as any;

    const leaders = (await query({
      query: `SELECT id, first_name, last_name FROM users WHERE id IN (${getReservations
        .map((r: any) => r.leader)
        .join(",")})`,
      values: [],
    })) as any;

    getReservations.forEach((reservation: any) => {
      reservation.groups = JSON.parse(reservation.groups);
      reservation.users = JSON.parse(reservation.users);
      reservation.leader = leaders.find(
        (leader: any) => leader.id === reservation.leader
      );
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
      getReservations.some((reservation: any) => reservation.users.length > 0)
    ) {
      const usersReservations = (await query({
        query: `SELECT id, reservations, email FROM users WHERE id IN (${getReservations
          .map((reservation: any) => reservation.users)
          .flat()
          .join(",")})`,
        values: [],
      })) as any;

      usersReservations.map((user: any) => {
        let usersReservations = JSON.parse(user.reservations);
        const result = usersReservations.filter((reservation: any) => {
          const resDetail = getReservations.find(
            (r: any) => r.id === reservation
          );
          if (reservations.includes(reservation) && resDetail.status !== 1) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email`, {
              method: "POST",
              body: JSON.stringify({
                to: user.email,
                subject: "Odstranění účtu z rezervace",
                html: NewReservationMember(resDetail, "remove"),
              }),
            });
          }
          return !reservations.includes(reservation);
        });

        query({
          query: `UPDATE users SET reservations = "${JSON.stringify(
            result
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
