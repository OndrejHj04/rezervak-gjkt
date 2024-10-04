import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

  if (request.nextUrl.searchParams.get("secret") === process.env.CRON_SECRET) {
    await query({
      query: `UPDATE reservations SET status = 1 WHERE status <> 1 AND status <> 5 AND to_date < CURDATE()`,
      values: [],
    })

    return NextResponse.json({
      message: "Success",
    }, {status: 200})
  }

  return NextResponse.json({ message: "Unautorized" }, { status: 401 })
};
