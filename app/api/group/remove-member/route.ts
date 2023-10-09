import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { currentMembers, group, membersForRemove } = await req.json();

    const remove = currentMembers.filter(
      (num: number) => !membersForRemove.includes(num)
    );

    const data = (await query({
      query: `UPDATE groups SET users = "${JSON.stringify(
        remove
      )}" WHERE id = ${group}`,
      values: [],
    })) as any;

    if (data.affectedRows === 0) throw new Error("Group not found");

    membersForRemove.forEach(async (member: any) => {
      const user = (await query({
        query: `SELECT groups FROM users WHERE id = ${member}`,
        values: [],
      })) as any;

      let groups = user[0].groups ? JSON.parse(user[0].groups) : null;

      const index = groups.indexOf(group);

      if (index > -1) {
        groups.splice(index, 1);
      }

      if (groups.length === 0) groups = null;

      await query({
        query: `UPDATE users SET groups = ${
          groups ? `"${JSON.stringify(groups)}"` : null
        } WHERE id = ${member}`,
        values: [],
      });
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: data,
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
