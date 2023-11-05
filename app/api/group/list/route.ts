import { query } from "@/lib/db";
import { Group, GroupOwner } from "@/types";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = (await query({
      query: "SELECT * FROM `groups`",
      values: [],
    })) as Group[];

    const users = (await query({
      query: "SELECT id, image, first_name, last_name, email FROM users",
      values: [],
    })) as GroupOwner[];

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
