import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { parse } from "url";

export async function GET(req: Request) {
  const URL = parse(req.url, true);
  const email = URL.query.email;
  const theme = (await query({
    query: `
    SELECT theme, id
FROM users
WHERE email = ?;
`,
    values: [email],
  })) as { theme: string }[];

  return NextResponse.json(theme[0]);
}
