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

    const reservations = (await query({
      query: sql,
      values: values,
    })) as any;

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
