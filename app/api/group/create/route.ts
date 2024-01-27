import { query } from "@/lib/db";
import protect from "@/lib/protect";
import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, description, owner } = await req.json();

    const isAuthorized = (await protect(
      req.headers.get("Authorization")
    )) as any;

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          message: "Auth failed",
        },
        { status: 500 }
      );
    }

    const newGroup = (await query({
      query: `INSERT INTO groups (name, description, owner) VALUES (?,?,?)`,
      values: [name, description, owner],
    })) as any;

    await query({
      query: `INSERT IGNORE INTO users_groups (userId, groupId, id) VALUES ("${owner}", "${
        newGroup.insertId
      }", ${JSON.stringify(`${owner},${newGroup.insertId}`)})`,
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: { name, newGroupId: newGroup.insertId },
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
