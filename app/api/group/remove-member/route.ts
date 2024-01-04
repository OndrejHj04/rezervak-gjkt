import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { currentMembers, group, membersForRemove } = await req.json();

    const remove = currentMembers.filter(
      (num: number) => !membersForRemove.includes(num)
    );

    const data = (await query({
      query: `UPDATE ${"`groups`"} SET users = "${JSON.stringify(
        remove
      )}" WHERE id = ${group}`,
      values: [],
    })) as any;

    membersForRemove.forEach(async (member: any) => {
      const user = (await query({
        query: `SELECT ${"`groups`"} FROM users WHERE id = ${member}`,
        values: [],
      })) as any;
      const userGroups = JSON.parse(user[0].groups).filter(
        (userGroup: any) => Number(userGroup) !== group
      );

      await query({
        query: `UPDATE users SET ${"`groups`"} = "${JSON.stringify(
          userGroups
        )}" WHERE id = ${member}`,
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
