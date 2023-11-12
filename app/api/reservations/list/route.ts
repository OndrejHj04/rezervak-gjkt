import { query } from "@/lib/db";
import { Reservation } from "@/types";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log("sex is good, but have you ever tried nextjs");
  try {
    console.log("1");
    const url = new URL(req.url);
    const userId = Number(url.searchParams.get("user_id"));
    const status = Number(url.searchParams.get("status"));
    const page = Number(url.searchParams.get("page"));
    const search = url.searchParams.get("search");

    let countSql = `SELECT COUNT(*) FROM reservations WHERE 1=1`;
    let countValues = [];
    console.log("2");

    if (status) {
      countSql += ` AND status = ?`;
      countValues.push(status);
    }
    if (search) {
      countSql += ` AND name LIKE ?`;
      countValues.push(`%${search}%`);
    }
    console.log("3");

    const count = (await query({
      query: countSql,
      values: countValues,
    })) as any;

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
    console.log("4");

    const reservations = (await query({
      query: sql,
      values: values,
    })) as any;

    const users = (await query({
      query: `SELECT id, first_name, last_name, email, image FROM users`,
      values: [],
    })) as any;
    console.log("5");

    const groups = (await query({
      query: `SELECT id, name FROM ${"`groups`"}`,
      values: [],
    })) as any;

    const statusList = (await query({
      query: `SELECT * FROM status`,
      values: [],
    })) as any;
    console.log("6");

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
    console.log("7");

    const data = userId
      ? reservations.filter(
          (reservation: any) =>
            reservation.users.includes(userId) ||
            reservation.leader.id === userId
        )
      : reservations;
    console.log("8");
    console.log("KURWA");
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
