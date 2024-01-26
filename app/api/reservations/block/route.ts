import { query } from "@/lib/db";
import protect from "@/lib/protect";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { from_date, to_date, userId } = await req.json();

    const isAuthorized = (await protect(
      req.headers.get("Authorization")
    )) as any;

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          message: "Auth failed",
        },
        { status: 500 }
      );
    }

    const fromDate = dayjs(from_date).format("YYYY-MM-DD");
    const toDate = dayjs(to_date).format("YYYY-MM-DD");

    await Promise.all([
      query({
        query: `UPDATE reservations SET status = 4 WHERE ((from_date BETWEEN '${fromDate}' AND '${toDate}') OR (to_date BETWEEN '${fromDate}' AND '${toDate}')) AND status <> 5 AND status <> 1`,
        values: [],
      }),
      query({
        query: `INSERT INTO reservations (from_date, to_date, name, status, leader, purpouse, instructions, creation_date) 
        VALUES ("${fromDate}", "${toDate}", "Blokace", 5, ${userId}, "blokace", "", ${dayjs().format(
          "YYYY-MM-DD"
        )})`,
        values: [],
      }),
    ]);
    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: { from_date, to_date },
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
