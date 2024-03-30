import { query } from "@/lib/db";
import protect from "@/lib/protect";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { groupId, userId } = await req.json();
    let result = { isMember: false, isOwner: false, exist: false };

    const [group, users] = (await Promise.all([
      query({
        query: `SELECT * FROM groups WHERE id = ?`,
        values: [groupId],
      }),
      query({
        query: `SELECT * FROM users_groups WHERE users_groups.groupId = ? AND users_groups.userId = ?`,
        values: [groupId, userId],
      }),
    ])) as any;

    if (group.length) {
      result.isMember = Boolean(users.length);
      result.isOwner = group[0].owner === userId;
      result.exist = true;
    }

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: result,
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
