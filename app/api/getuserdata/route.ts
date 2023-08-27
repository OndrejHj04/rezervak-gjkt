import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { parse } from "url";

export async function GET(req: Request, res: Response) {
  const URL = parse(req.url, true);
  const { id } = URL.query;

  const user = (await query({
    query: `SELECT * FROM users WHERE id = ? LIMIT 1`,
    values: [id],
  })) as {}[];

  return NextResponse.json(user[0]);
}
