import { query } from "@/lib/db";
import { Group, GroupOwner } from "@/types";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const data = (await query({
      query: `
        SELECT * FROM ${"`groups`"} WHERE id = ?`,
      values: [id],
    })) as any;

    const [owner, users, reservations] = (await Promise.all([
      query({
        query: `
      SELECT id, image, first_name, last_name, email FROM users WHERE id = ${data[0].owner}`,
        values: [],
      }),
      query({
        query: `
      SELECT id, image, first_name, last_name, email FROM users ${
        JSON.parse(data[0].users).length
          ? `WHERE id IN (${JSON.parse(data[0].users).join(",")})`
          : `WHERE 1=2`
      }`,
        values: [],
      }),
      query({
        query: `
      SELECT id, name, from_date, to_date, users FROM reservations ${
        JSON.parse(data[0].reservations).length
          ? `WHERE id IN (${JSON.parse(data[0].reservations).join(",")})`
          : `WHERE 1=2`
      }`,
        values: [],
      }),
    ])) as any;
    data[0].owner = owner[0];
    data[0].users = users[0] || [];
    data[0].reservations = reservations[0] || [];

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
