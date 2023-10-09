import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { currentMembers, newMembers, group } = await req.json();

    const data = await query({
      query: `UPDATE groups SET users = "${JSON.stringify([
        ...currentMembers,
        ...newMembers,
      ])}" WHERE id = ${group}`,
      values: [],
    });

    newMembers.forEach(async (member: any) => {
      const user = (await query({
        query: `SELECT groups FROM users WHERE id = ${member}`,
        values: [],
      })) as any;

      const groups = user[0].groups ? JSON.parse(user[0].groups) : [];

      groups.push(group);

      await query({
        query: `UPDATE users SET groups = "${JSON.stringify(
          groups
        )}" WHERE id = ${member}`,
        values: [],
      });
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
