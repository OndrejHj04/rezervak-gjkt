import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { groups } = await req.json();

  const data = await query({
    query: `DELETE FROM groups WHERE id IN (${groups.join(",")});`,
    values: [],
  });

  groups.map(async (group) => {
    const userGroups = (await query({
      query: `SELECT id, groups FROM users`,
      values: [],
    })) as any;

    userGroups.map(async (user: any) => {
      let groupsData = user.groups ? JSON.parse(user.groups) : null;

      if (groupsData.includes(group)) {
        groupsData = groupsData.filter((num: number) => num !== group);
        if (groupsData.length) {
          await query({
            query: `UPDATE users SET groups = "${JSON.stringify(
              groupsData
            )}" WHERE id = "${user.id}"`,
            values: [],
          });
        } else {
          await query({
            query: `UPDATE users SET groups = null WHERE id = "${user.id}"`,
            values: [],
          });
        }
      }
    });
  });

  try {
    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: [],
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        success: false,
        message: e.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
