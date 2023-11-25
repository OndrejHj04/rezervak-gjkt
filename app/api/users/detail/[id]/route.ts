import { query } from "@/lib/db";
import { group } from "console";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const data = (await query({
      query: `
      SELECT * FROM users WHERE id = ?
    `,
      values: [id],
    })) as any;

    const [role, groups, reservations] = (await Promise.all([
      query({
        query: `
        SELECT * FROM roles WHERE id = ${data[0].role}
      `,
        values: [],
      }),
      query({
        query: `
        SELECT * FROM ${"`groups`"} WHERE id IN (?)
      `,
        values: [JSON.parse(data[0].groups).join(",")],
      }),
      query({
        query: `
        SELECT * FROM reservations WHERE id IN (?)
      `,
        values: [JSON.parse(data[0].reservations).join(",")],
      }),
    ])) as any;

    data[0].role = role[0];
    data[0].groups = groups;
    data[0].reservations = reservations;

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: data[0],
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
