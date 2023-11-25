import { query } from "@/lib/db";
import { GroupOwner } from "@/types";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page"));
    const search = url.searchParams.get("search");
    const userId = Number(url.searchParams.get("user_id"));

    let sql = `SELECT * FROM ${"`groups`"}`;
    const values: any = [];

    if (search) {
      sql += ` WHERE name LIKE ${`"%${search}%"`}`;
    }

    if (page) {
      sql += ` LIMIT 10 OFFSET ${page * 10 - 10}`;
    }
    console.log(sql)
    const [count, groups, users] = (await Promise.all([
      query({
        query: `SELECT COUNT(*) FROM ${"`groups`"} ${
          search ? `WHERE name LIKE "%${search}%"` : ""
        }`,
        values: [],
      }),
      query({
        query: sql,
        values: values,
      }),
      query({
        query: `
        SELECT id, image, first_name, last_name, email FROM users
      `,
        values: [],
      }),
    ])) as any;

    groups.map((item: any) => {
      item.owner = users.find(
        (user: any) => user.id === (item.owner as unknown as number)
      ) as unknown as GroupOwner;
      item.users = item.users ? JSON.parse(item.users as any) : [];
      item.reservations = item.reservations
        ? JSON.parse(item.reservations as any)
        : [];
    });

    const data = userId
      ? groups.filter(
          (group: any) =>
            group.users.includes(userId) || group.owner.id === userId
        )
      : groups;

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
