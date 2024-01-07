import { query } from "@/lib/db";
import NewReservationMember from "@/templates/reservationUserEdit/template";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reservation, newUsers, currentUsers } = await req.json();

    const [_, users] = (await Promise.all([
      query({
        query: `UPDATE reservations SET users = "[${[
          ...currentUsers,
          ...newUsers,
        ]}]" WHERE id = ${reservation.id}`,
        values: [],
      }),

      query({
        query: `SELECT id, reservations, email FROM users WHERE id IN (${newUsers.join(
          ","
        )})`,
        values: [],
      }),
    ])) as any;

    users.map(async (user: any) => {
      await Promise.all([
        query({
          query: `UPDATE users SET reservations = "${JSON.stringify([
            ...JSON.parse(user.reservations),
            reservation.id,
          ])}" WHERE id = ${user.id}`,
          values: [],
        }),

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email`, {
          method: "POST",
          body: JSON.stringify({
            to: user.email,
            subject: "Nová rezervace",
            html: NewReservationMember(reservation, "add"),
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
