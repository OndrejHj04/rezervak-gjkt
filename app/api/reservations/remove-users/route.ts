import { query } from "@/lib/db";
import NewReservationMember from "@/templates/reservationUserEdit/template";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reservation, removeUsers, currentUsers } = await req.json();

    const [_, users] = (await Promise.all([
      query({
        query: `UPDATE reservations SET users = "${JSON.stringify(
          currentUsers.filter((user: any) => !removeUsers.includes(user))
        )}" WHERE id = ${reservation.id}`,
        values: [],
      }),
      query({
        query: `SELECT * FROM users WHERE id IN (${removeUsers.join(",")})`,
        values: [],
      }),
    ])) as any;

    users.map(async (user: any) => {
      user.reservations = JSON.parse(user.reservations);
      let newReservation = (user.reservations = user.reservations.filter(
        (res: any) => res !== reservation.id
      ));

      await Promise.all([
        query({
          query: `UPDATE users SET reservations = "${JSON.stringify(
            newReservation
          )}" WHERE id = ${user.id}`,
          values: [],
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email`, {
          method: "POST",
          body: JSON.stringify({
            to: user.email,
            subject: "Upozorenění na rezervaci",
            html: NewReservationMember(reservation, "remove"),
          }),
        }),
      ]);
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: users,
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
