import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reservation, newUsers, currentUsers } = await req.json();

    const getReservation = await query({
      query: `UPDATE reservations SET users = "[${[
        ...currentUsers,
        ...newUsers,
      ]}]" WHERE id = ${reservation}`,
      values: [],
    });

    const users = (await query({
      query: `SELECT id, reservations FROM users WHERE id IN (${newUsers.join(
        ","
      )})`,
      values: [],
    })) as any;
    users.forEach((user: any) => {
      user.reservations = JSON.parse(user.reservations);
    });

    users.map(async (user: any) => {
      await query({
        query: `UPDATE users SET reservations = "${JSON.stringify([
          ...user.reservations,
          reservation,
        ])}" WHERE id = ${user.id}`,
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
