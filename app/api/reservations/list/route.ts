import { query } from "@/lib/db";
import { Reservation } from "@/types";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = Number(url.searchParams.get("user_id"));
    const status = Number(url.searchParams.get("status"));
    const page = Number(url.searchParams.get("page"));

    const count = (await query({
      query: `SELECT COUNT(*) FROM reservations ${
        status ? `WHERE status = ${status}` : ""
      }`,
      values: [],
    })) as any;

    let sql = `SELECT * FROM reservations`;

    if (status) sql += ` WHERE status = ${status}`;
    if (page) sql += ` LIMIT 10 OFFSET ${page * 10 - 10}`;

    const reservations = (await query({
      query: sql,
      values: [],
    })) as any;

    const users = (await query({
      query: `SELECT id, first_name, last_name, email, image FROM users`,
      values: [],
    })) as any;

    const groups = (await query({
      query: `SELECT id, name FROM groups`,
      values: [],
    })) as any;

    const statusList = (await query({
      query: `SELECT * FROM status`,
      values: [],
    })) as any;

    reservations.map((reservation: any) => {
      reservation.status = statusList.find(
        (s: any) => s.id === reservation.status
      );
      reservation.users = JSON.parse(reservation.users);
      reservation.groups = JSON.parse(reservation.groups).map((group: any) =>
        groups.find((g: any) => g.id === group)
      );
      reservation.leader = users.find((u: any) => u.id === reservation.leader);
    });

    const data = userId
      ? reservations.filter(
          (reservation: any) =>
            reservation.users.includes(userId) ||
            reservation.leader.id === userId
        )
      : reservations;

    return NextResponse.json({
      count: count[0]["COUNT(*)"],
      success: true,
      message: "Operation successful",
      data: data,
    });
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
        error: e,
      },
      { status: 500 }
    );
  }
}
