import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { Group } from "@/types";

export async function GET(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const data = (await query({
      query: `
            SELECT groups FROM users WHERE id = "
            ${id}"
          `,
      values: [id],
    })) as any;
    const groupList = data[0].groups ? JSON.parse(data[0].groups as any) : [];

    const groupsDetail = groupList.length
      ? await query({
          query: `
        SELECT * FROM groups WHERE id IN (${groupList.join(",")})
      `,
          values: [],
        })
      : [];

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: groupsDetail,
    });
  } catch (e) {
    NextResponse.error();
  }
}
