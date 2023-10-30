import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { currentReservations, newReservations, group } = await req.json();

    const data = await query({
      query: `UPDATE groups SET reservations = "${JSON.stringify([
        ...currentReservations,
        ...newReservations,
      ])}" WHERE id = ${group}`,
      values: [],
    });

    newReservations.forEach(async (reserv: any) => {
      const user = (await query({
        query: `SELECT groups FROM reservations WHERE id = ${reserv}`,
        values: [],
      })) as any;

      const groups = user[0].groups ? JSON.parse(user[0].groups) : [];

      groups.push(group);

      await query({
        query: `UPDATE reservations SET groups = "${JSON.stringify(
          groups
        )}" WHERE id = ${reserv}`,
        values: [],
      });
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
