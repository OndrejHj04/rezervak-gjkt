import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { currentMembers, newMembers, group } = await req.json();
    console.log(currentMembers, newMembers, group )
    const data = await query({
      query: `UPDATE groups SET users = "${JSON.stringify([
        ...currentMembers,
        ...newMembers,
      ])}" WHERE id = ${group}`,
      values: [],
    });

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
