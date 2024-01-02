import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { groupId, userId } = await req.json();

    const group = (await query({
      query: `
      SELECT owner, users FROM ${"`groups`"} WHERE id = ${groupId}
      `,
      values: [],
    })) as any;
    const isMember = JSON.parse(group[0].users).includes(userId);
    const isOwner = group[0].owner === userId;

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: { isMember, isOwner },
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
