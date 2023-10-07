import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { currentMembers, group, membersForRemove } = await req.json();

    const remove = currentMembers.filter(
      (num: number) => !membersForRemove.includes(num)
    );

    const data = (await query({
      query: `UPDATE groups SET users = "${JSON.stringify(
        remove
      )}" WHERE id = ${group}`,
      values: [],
    })) as any;

    if (data.affectedRows === 0) throw new Error("Group not found");

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
