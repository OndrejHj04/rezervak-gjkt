import { query } from "@/lib/db";
import { Reservation } from "@/types";
import { stat } from "fs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  console.log("WELCOME")
  try {
    const data = (await query({
      query: `SELECT * FROM reservations WHERE id = ?`,
      values: [id],
    })) as any;
    console.log("1")
    data.forEach((reservation: any) => {
      reservation.groups = reservation.groups
        ? JSON.parse(reservation.groups as any)
        : [];
      reservation.users = reservation.users
        ? JSON.parse(reservation.users as any)
        : [];
    });
    console.log("2")

    const leader = (await query({
      query: `SELECT id, email, first_name, last_name, image FROM users WHERE id IN(${data.map(
        (reservation: any) => reservation.leader
      )})`,
      values: [],
    })) as any;
    console.log("3")

    if (data[0].groups.length !== 0) {
      const groups = (await query({
        query: `SELECT * FROM groups WHERE id IN(${data.map(
          (reservation: any) => reservation.groups.join(",")
        )})`,
        values: [],
      })) as any;
    console.log("4")

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
    console.log("5")

    const users = data.some((item: any) => item.users.length)
      ? ((await query({
          query: `SELECT id, first_name, last_name, email, image FROM users WHERE id IN(${data.map(
            (reservation: any) => reservation.users.join(",")
          )})`,
          values: [],
        })) as any)
      : [];
      console.log("6")

    data.forEach((reservation: Reservation) => {
      reservation.leader = leader.find(
        (lead: any) => lead.id === reservation.leader
      );
      reservation.users = reservation.users.map((user) =>
        users.find((grp: any) => grp.id === user)
      );
      reservation.status = status[0];
    });
    console.log("7")

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
