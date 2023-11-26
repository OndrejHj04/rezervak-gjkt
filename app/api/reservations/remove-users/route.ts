import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("start");
  try {
    const { reservation, removeUsers, currentUsers } = await req.json();
    console.log(reservation, removeUsers, currentUsers);
    const getReservation = await query({
      query: `UPDATE reservations SET users = "${JSON.stringify(
        currentUsers.filter((user: any) => !removeUsers.includes(user))
      )}" WHERE id = ${reservation}`,
      values: [],
    });
    console.log('1')
    const users = (await query({
      query: `SELECT id, reservations FROM users WHERE id IN (${removeUsers.join(
        ","
      )})`,
      values: [],
    })) as any;
    console.log('2')

    users.forEach((user: any) => {
      user.reservations = JSON.parse(user.reservations);
    });
    console.log('3')

    users.map(async (user: any) => {
      let newReservation = (user.reservations = user.reservations.filter(
        (res: any) => res !== reservation
      ));

      await query({
        query: `UPDATE users SET reservations = "${JSON.stringify(
          newReservation
        )}" WHERE id = ${user.id}`,
        values: [],
      });
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
