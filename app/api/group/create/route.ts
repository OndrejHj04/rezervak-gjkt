import { query } from "@/lib/db";
import GroupUsersEdit from "@/templates/groupUserEdit/template";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, description, owner } = await req.json();
    const members = [owner.id];

    const [data, groups, _] = (await Promise.all([
      query({
        query: `INSERT INTO ${"`groups`"} (name, description, owner, users) VALUES ("${name}", ${
          description ? `"${description}"` : null
        }, "${owner.id}", "${JSON.stringify(members)}")`,
        values: [],
      }),
      query({
        query: `SELECT ${"`groups`"} FROM users WHERE id = "${owner.id}"`,
        values: [],
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email`, {
        method: "POST",
        body: JSON.stringify({
          to: owner.email,
          subject: "Nová skupina",
          html: GroupUsersEdit({ name, owner }, "add"),
        }),
      }),
    ])) as any;
    const newGroupId = data.insertId;

    const userGroups = JSON.parse(groups[0].groups);

    const editGroups = await query({
      query: `UPDATE users SET ${"`groups`"} = "${
        userGroups
          ? JSON.stringify([...userGroups, newGroupId])
          : JSON.stringify([newGroupId])
      }" WHERE id = "${owner.id}"`,
      values: [],
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: { name, newGroupId },
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
