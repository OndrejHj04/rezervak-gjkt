import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, description, owner, users } = await req.json();

    const members = users ? [...users, owner] : [owner];

    const data = await query({
      query: `INSERT INTO groups(name, description, owner, users) VALUES ("${name}", ${description ? `"${description}"` : null}, "${owner}", "${JSON.stringify(members)}")`,
      values: [],
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: { name },
    });
  } catch (e: any) {
    return NextResponse.error();
  }
}
