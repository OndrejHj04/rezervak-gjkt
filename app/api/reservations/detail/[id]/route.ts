import { query } from "@/lib/db";
import { Reservation } from "@/types";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const data = (await query({
      query: `SELECT * FROM reservations WHERE id = ?`,
      values: [id],
    })) as any;

    data.forEach((reservation: any) => {
      reservation.groups = reservation.groups
        ? JSON.parse(reservation.groups as any)
        : [];
      reservation.users = reservation.users
        ? JSON.parse(reservation.users as any)
        : [];
    });

    const leader = (await query({
      query: `SELECT id, email, first_name, last_name FROM users WHERE id IN(${data.map(
        (reservation: any) => reservation.leader
      )})`,
      values: [],
    })) as any;

    const groups = (await query({
      query: `SELECT * FROM groups WHERE id IN(${data.map((reservation: any) =>
        reservation.groups.join(",")
      )})`,
      values: [],
    })) as any;
    groups.map((group: any) => (group.users = JSON.parse(group.users as any)));

    const users = (await query({
      query: `SELECT id, first_name, last_name, email, image FROM users WHERE id IN(${data.map(
        (reservation: any) => reservation.users.join(",")
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
      reservation.users = reservation.users.map((user) =>
        users.find((grp: any) => grp.id === user)
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
