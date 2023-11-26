import { query } from "@/lib/db";
import { Reservation } from "@/types";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const data = (await query({
      query: `SELECT * FROM reservations WHERE id = ?`,
      values: [id],
    })) as any;

    const [users, groups] = (await Promise.all([
      query({
        query: `SELECT id, first_name, last_name, image FROM users WHERE id IN (?)`,
        values: [JSON.parse(data[0].users).join(",")],
      }),
      query({
        query: `SELECT * FROM ${"`groups`"} WHERE id IN (?)`,
        values: [JSON.parse(data[0].groups).join(",")],
      }),
    ])) as any;

    data[0].users = users;
    data[0].groups = groups;
    data[0].leader = users.find((user: any) => user.id === data[0].leader);

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
