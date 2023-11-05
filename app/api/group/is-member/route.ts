import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const account = Number(url.searchParams.get("id"));
    const group = url.searchParams.get("group");

    const data = (await query({
      query: `
        SELECT users FROM ${"`groups`"} WHERE id = ?`,
      values: [group],
    })) as any;

    const groupMembers = data.length
      ? JSON.parse(data[0].users).includes(account)
      : false;

    return NextResponse.json({
      isMember: groupMembers,
    });
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
