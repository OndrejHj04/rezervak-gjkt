import { query } from "@/lib/db";
import { Group, GroupOwner } from "@/types";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = (await query({
      query: `
      SELECT * FROM groups
    `,
      values: [],
    })) as Group[];

    const owner = (await query({
      query: `
      SELECT id, image, first_name, last_name FROM users WHERE id = ${data[0].owner}
    `,
      values: [],
    })) as GroupOwner[];

    data.map((item) => {
      item.owner = owner[0];
      item.users = item.users ? JSON.parse(item.users as any) : [];
      return item;
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: data,
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
