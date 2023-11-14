import { query } from "@/lib/db";
import { Group, GroupOwner } from "@/types";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page"));

    const count = (await query({
      query: "SELECT COUNT(*) FROM `groups`",
      values: [],
    })) as any;

    const data = (await query({
      query: `SELECT * FROM ${"`groups`"} LIMIT 10 OFFSET ${page * 10 - 10}`,
      values: [],
    })) as Group[];

    const users = (await query({
      query: `
      SELECT id, image, first_name, last_name, email FROM users
    `,
      values: [],
    })) as GroupOwner[];

    data.map((item) => {
      item.owner = users.find(
        (user) => user.id === (item.owner as unknown as number)
      ) as unknown as GroupOwner;
      item.users = item.users ? JSON.parse(item.users as any) : [];
      item.reservations = item.reservations
        ? JSON.parse(item.reservations as any)
        : [];
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: data,
      count: count[0]["COUNT(*)"],
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
