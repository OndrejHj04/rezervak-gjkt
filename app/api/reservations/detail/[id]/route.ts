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
      query: `SELECT id, email, first_name, last_name, image FROM users WHERE id IN(${data.map(
        (reservation: any) => reservation.leader
      )})`,
      values: [],
    })) as any;

    if (data[0].groups.length !== 0) {
      const groups = (await query({
        query: `SELECT * FROM ${"`groups`"} WHERE id IN(${data.map(
          (reservation: any) => reservation.groups.join(",")
        )})`,
        values: [],
      })) as any;

      groups.map(
        (group: any) => (group.users = JSON.parse(group.users as any))
      );
      data[0].groups = groups;
    }
    const status = (await query({
      query: `SELECT * FROM status WHERE id IN(${data.map(
        (reservation: any) => reservation.status
      )})`,
      values: [],
    })) as any;

    const users = data.some((item: any) => item.users.length)
      ? ((await query({
          query: `SELECT id, first_name, last_name, email, image FROM users WHERE id IN(${data.map(
            (reservation: any) => reservation.users.join(",")
          )})`,
          values: [],
        })) as any)
      : [];

    data.forEach((reservation: Reservation) => {
      reservation.leader = leader.find(
        (lead: any) => lead.id === reservation.leader
      );
      reservation.users = reservation.users.map((user) =>
        users.find((grp: any) => grp.id === user)
      );
      reservation.status = status[0];
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: data,
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
