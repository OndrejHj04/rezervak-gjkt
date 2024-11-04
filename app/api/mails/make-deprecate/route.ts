import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (request.nextUrl.searchParams.get("secret") === process.env.CRON_SECRET) {
    await query({
      query: `DELETE FROM emails WHERE emails.date < DATE_SUB(CURDATE(), INTERVAL 1 MONTH)`,
      values: []
    })

    return NextResponse.json({
      message: "Success",
    }, { status: 200 })
  }

  return NextResponse.json({ message: "Unautorized" }, { status: 401 })
}
