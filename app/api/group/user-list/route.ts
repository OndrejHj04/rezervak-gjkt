import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = Number(url.searchParams.get("id"));
    const page = Number(url.searchParams.get("page"));

    const [groups, count] = (await Promise.all([
      query({
        query: `SELECT name, description, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email, 'image', users.image) AS owner 
        FROM groups INNER JOIN users_groups ON groups.id = users_groups.groupId INNER JOIN users ON groups.owner = users.id 
        WHERE users_groups.userId = ? LIMIT 10 OFFSET ?`,
        values: [id, page * 10 - 10],
      }),
      query({
        query: `SELECT COUNT(*) as total FROM users_groups WHERE users_groups.userId = ?`,
        values: [id],
      }),
    ])) as any;

    const data = groups.map((group: any) => {
      return {
        ...group,
        owner: JSON.parse(group.owner),
      };
    });
    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: data,
      count: count[0].total,
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
