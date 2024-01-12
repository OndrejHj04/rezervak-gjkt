import { query } from "@/lib/db";
import GroupUsersEdit from "@/templates/groupUserEdit/template";
import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, description, owner } = await req.json();

    const newGroup = (await query({
      query: `INSERT INTO groups (name, description, owner) VALUES ("${name}", ${
        description ? `"${description}"` : null
      }, "${owner}")`,
    })) as any;

    await query({
      query: `INSERT IGNORE INTO users_groups (userId, groupId, id) VALUES ("${owner}", "${
        newGroup.insertId
      }", ${JSON.stringify(`${owner},${newGroup.insertId}`)})`,
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: [],
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
