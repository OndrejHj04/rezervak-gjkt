import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, description, owner, users } = await req.json();

    const members = users ? [...users, owner] : [owner];

    const data = (await query({
      query: `INSERT INTO groups(name, description, owner, users) VALUES ("${name}", ${
        description ? `"${description}"` : null
      }, "${owner}", "${JSON.stringify(members)}")`,
      values: [],
    })) as any;
    const newGroupId = data.insertId;
    const groups = (await query({
      query: `SELECT groups FROM users WHERE id = "${owner}"`,
      values: [],
    })) as any;
    const userGroups = JSON.parse(groups[0].groups);

    const editGroups = await query({
      query: `UPDATE users SET groups = "${
        userGroups
          ? JSON.stringify([...userGroups, newGroupId])
          : JSON.stringify([newGroupId])
      }" WHERE id = "${owner}"`,
      values: [],
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: { name },
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
