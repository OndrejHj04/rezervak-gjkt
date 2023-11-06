import { query } from "@/lib/db";
import { Reservation } from "@/types";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    console.log("WELCOME");

    const url = new URL(req.url);
    const userId = Number(url.searchParams.get("user_id"));
    console.log("1");
    const data =
      ((await query({
        query: `SELECT * FROM reservations`,
        values: [],
      })) as any) || [];
    console.log("2");

    const filtered = data
      .map((reservation: any) => {
        reservation.groups = reservation.groups
          ? JSON.parse(reservation.groups as any)
          : [];
        reservation.users = reservation.users
          ? JSON.parse(reservation.users as any)
          : [];
        return reservation;
      })
      .filter((reservation: any) => {
        return userId ? reservation.users.includes(userId) : true;
      });
    console.log("3");

    const leader =
      filtered.length &&
      ((await query({
        query: `SELECT id, email, first_name, last_name, image FROM users WHERE id IN(${filtered
          .map((reservation: any) => reservation.leader)
          .join(",")})`,
        values: [],
      })) as any);
    console.log("4");

    const groupIds = [
      ...(new Set(filtered.map((item: any) => item.groups).flat()) as any),
    ] as any;
    const groupIdsList = groupIds.length ? groupIds : [-1];
    console.log("5");

    const groups = (await query({
      query: `SELECT id, name FROM ${"`groups`"} WHERE id IN(${groupIdsList.join(
        ","
      )})`,
      values: [],
    })) as any;
    console.log("6");

    const status = (await query({
      query: `SELECT * FROM status`,
      values: [],
    })) as any;
    console.log("7");

    filtered.forEach((reservation: Reservation) => {
      reservation.leader = leader.find(
        (lead: any) => lead.id === reservation.leader
      );
      reservation.groups = reservation.groups.map((group) =>
        groups.find((grp: any) => grp.id === group)
      );
      reservation.status = status.find(
        (state: any) => state.id === reservation.status
      );
    });
    console.log("8");

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: filtered,
    });
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
