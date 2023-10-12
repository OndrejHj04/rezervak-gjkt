import { query } from "@/lib/db";
import { Group } from "@/types";
import { NextResponse } from "next/server";
import { use } from "react";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("user_id");

    const data = (await query({
      query: `
        SELECT id, groups from users WHERE id = "${userId}"
        `,
      values: [],
    })) as any;

    const userGroups = JSON.parse(data[0].groups);

    const getUserGroups = userGroups
      ? ((await query({
          query: `SELECT name, owner, id from groups WHERE id IN (${userGroups.join(
            ","
          )})`,
          values: [],
        })) as any)
      : [];

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: getUserGroups,
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
