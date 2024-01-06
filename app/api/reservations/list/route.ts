import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const status = Number(url.searchParams.get("status"));
    const page = Number(url.searchParams.get("page"));
    const search = url.searchParams.get("search");
    const limit = Number(url.searchParams.get("limit")) || 10;
    let countSql = `SELECT COUNT(*) FROM reservations WHERE 1=1`;

    if (status) {
      countSql += ` AND status = ${status}`;
    }
    if (search) {
      countSql += ` AND name LIKE ${`"%${search}%"`}`;
    }

    let sql = `SELECT * FROM reservations WHERE 1=1`;

    if (status) {
      sql += ` AND status = ${status}`;
    }
    if (search) {
      sql += ` AND name LIKE ${`"%${search}%"`}`;
    }
    if (page) {
      sql += ` LIMIT ${limit} OFFSET ${page * limit - limit}`;
    }

    const [count, reservations, users, groups, statusList] = (await Promise.all(
      [
        query({
          query: countSql,
          values: [],
        }),
        query({
          query: sql,
          values: [],
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

    return NextResponse.json({
      count: count[0]["COUNT(*)"],
      success: true,
      message: "Operation successful",
      data: reservations,
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
