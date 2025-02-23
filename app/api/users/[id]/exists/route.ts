import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, {params}:any) {
  const { user } = await req.json();
  const data = (await query({
    query: `
      SELECT id 
      FROM users 
      WHERE id = ?
      AND (? != 3 OR email = ?)
    `,
    values: [params.id, user.role.id, user.email],
  })) as any;

  return NextResponse.json({ exists: Boolean(data.length) });
}
