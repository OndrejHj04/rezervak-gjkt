import { query } from "@/lib/db";
import { Group, GroupOwner } from "@/types";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page"));
    const search = url.searchParams.get("search");
    console.log("1");
    const count = (await query({
      query: `SELECT COUNT(*) FROM ${"`groups`"} ${
        search ? `WHERE name LIKE "%${search}%"` : ""
      }`,
      values: [],
    })) as any;
    console.log("2");

    let sql = `SELECT * FROM ${"`groups`"}`;
    let values = [];

    if (search) {
      sql += ` WHERE name LIKE ?`;
      values.push(`%${search}%`);
    }
    console.log("3");

    if (page) {
      sql += ` LIMIT 10 OFFSET ?`;
      values.push(page * 10 - 10);
    }
    console.log("4");

    const data = (await query({
      query: sql,
      values: values,
    })) as Group[];
    console.log("5");

    const users = (await query({
      query: `
      SELECT id, image, first_name, last_name, email FROM users
    `,
      values: [],
    })) as GroupOwner[];
    console.log("6", data);

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
