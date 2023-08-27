import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { parse } from "url";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "No id provided" }, { status: 400 });
  }

  const user = (
    (await query({
      query: `SELECT * FROM users WHERE id = ? LIMIT 1`,
      values: [id],
    })) as {}[]
  )[0];

  if (!user) {
    return NextResponse.json({ data: null }, { status: 404 });
  }

  return NextResponse.json({ data: user });
}
