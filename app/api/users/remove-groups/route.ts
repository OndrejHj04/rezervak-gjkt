import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { user, currentGroups, removeGroups } = await req.json();

    const getUsers = await query({
      query: `UPDATE users SET ${"`groups`"} = "${JSON.stringify(
        currentGroups.filter((group: any) => !removeGroups.includes(group))
      )}" WHERE id = ${user}`,
      values: [],
    });

    const groups = (await query({
      query: `SELECT * FROM ${"`groups`"} WHERE id IN (${removeGroups.join(",")})`,
      values: [],
    })) as any;

    groups.forEach((group: any) => {
      group.users = JSON.parse(group.users);
    });

    groups.map(async (group: any) => {
      let newUsers = (group.users = group.users.filter(
        (res: any) => res !== user
      ));

      await query({
        query: `UPDATE ${"`groups`"} SET users = "${JSON.stringify(
          newUsers
        )}" WHERE id = ${group.id}`,
        values: [],
      });
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: [],
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
