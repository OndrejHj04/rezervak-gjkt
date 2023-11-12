import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, description, owner, users } = await req.json();
    console.log("1");
    const members = users ? [...users, owner] : [owner];
    console.log(
      `INSERT INTO ${"`groups`"}(name, description, owner, users) VALUES ("${name}", ${
        description ? `"${description}"` : null
      }, "${owner}", "${JSON.stringify(members)}")`
    );
    const data = (await query({
      query: `INSERT INTO ${"`groups`"}(name, description, owner, users) VALUES ("${name}", ${
        description ? `"${description}"` : null
      }, "${owner}", "${JSON.stringify(members)}")`,
      values: [],
    })) as any;
    const newGroupId = data.insertId;
    console.log("2");

    const groups = (await query({
      query: `SELECT ${"`groups`"} FROM users WHERE id = "${owner}"`,
      values: [],
    })) as any;
    const userGroups = JSON.parse(groups[0].groups);
    console.log("3");

    const editGroups = await query({
      query: `UPDATE users SET ${"`groups`"} = "${
        userGroups
          ? JSON.stringify([...userGroups, newGroupId])
          : JSON.stringify([newGroupId])
      }" WHERE id = "${owner}"`,
      values: [],
    });
    console.log("4");

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
