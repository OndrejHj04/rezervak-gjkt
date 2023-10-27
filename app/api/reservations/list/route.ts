import { query } from "@/lib/db";
import { Reservation } from "@/types";
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

    const leader = (await query({
      query: `SELECT id, email, first_name, last_name, image FROM users WHERE id IN(${data
        .map((reservation: any) => reservation.leader)
        .join(",")})`,
      values: [],
    })) as any;
    const groupIds = [
      ...(new Set(data.map((item: any) => item.groups).flat()) as any),
    ] as any;
    const groupIdsList = groupIds.length ? groupIds : [-1];

    const groups = (await query({
      query: `SELECT id, name FROM groups WHERE id IN(${groupIdsList.join(
        ","
      )})`,
      values: [],
    })) as any;

    data.forEach((reservation: Reservation) => {
      reservation.leader = leader.find(
        (lead: any) => lead.id === reservation.leader
      );
      reservation.groups = reservation.groups.map((group) =>
        groups.find((grp: any) => grp.id === group)
      );
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
