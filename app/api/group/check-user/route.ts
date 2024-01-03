import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { groupId, userId } = await req.json();
    let result = { isMember: false, isOwner: false, exist: false };

    const group = (await query({
      query: `
      SELECT owner, users FROM ${"`groups`"} WHERE id = ${groupId}
      `,
      values: [],
    })) as any;
    
    if (group.length) {
      result.isMember = JSON.parse(group[0].users).includes(userId);
      result.isOwner = group[0].owner === userId;
      result.exist = true
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
