import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reservation, removeUsers, currentUsers } = await req.json();

    const getReservation = await query({
      query: `UPDATE reservations SET users = "${JSON.stringify(
        currentUsers.filter((user: any) => !removeUsers.includes(user))
      )}" WHERE id = ${reservation}`,
      values: [],
    });

    const users = (await query({
      query: `SELECT id, reservations FROM users WHERE id IN (${removeUsers.join(
        ","
      )})`,
      values: [],
    })) as any;

    users.forEach((user: any) => {
      user.reservations = JSON.parse(user.reservations);
    });

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
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    },{ status: 500 });
  }
}
