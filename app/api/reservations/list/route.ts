import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const data = (await query({
      query: `SELECT * FROM reservations`,
      values: [],
    })) as any;

    data.map((reservation: any) => {
      reservation.groups = reservation.groups
        ? JSON.parse(reservation.groups as any)
        : [];
      reservation.users = reservation.users
        ? JSON.parse(reservation.users as any)
        : [];
      return reservation;
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: data,
    });
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
