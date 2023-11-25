import { query } from "@/lib/db";
import { Reservation } from "@/types";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = Number(url.searchParams.get("user_id"));
    const status = Number(url.searchParams.get("status"));
    const page = Number(url.searchParams.get("page"));
    const search = url.searchParams.get("search");

    let countSql = `SELECT COUNT(*) FROM reservations WHERE 1=1`;
    let countValues = [];

    if (status) {
      countSql += ` AND status = ?`;
      countValues.push(status);
    }
    if (search) {
      countSql += ` AND name LIKE ?`;
      countValues.push(`%${search}%`);
    }

    let sql = `SELECT * FROM reservations WHERE 1=1`;
    let values = [];
    if (status) {
      sql += ` AND status = ?`;
      values.push(status);
    }
    if (search) {
      sql += ` AND name LIKE ?`;
      values.push(`%${search}%`);
    }
    if (page) {
      sql += ` LIMIT 10 OFFSET ?`;
      values.push(page * 10 - 10);
    }

    const [count, reservations, users, groups, statusList] = (await Promise.all(
      [
        query({
          query: countSql,
          values: countValues,
        }),
        query({
          query: sql,
          values: values,
        }),
        query({
          query: `SELECT id, first_name, last_name, email, image FROM users`,
          values: [],
        }),
        query({
          query: `SELECT id, name FROM ${"`groups`"}`,
          values: [],
        }),
        query({
          query: `SELECT * FROM status`,
          values: [],
        }),
      ]
    )) as any[];

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
