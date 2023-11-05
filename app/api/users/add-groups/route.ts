import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { user, newGroups, currentGroups } = await req.json();

    const getGroups = await query({
      query: `UPDATE users SET ${"`groups`"} = "[${[
        ...currentGroups,
        ...newGroups,
      ]}]" WHERE id = ${user}`,
      values: [],
    });

    const groups = (await query({
      query: `SELECT id, users FROM ${"`groups`"} WHERE id IN (${newGroups.join(
        ","
      )})`,
      values: [],
    })) as any;
    groups.forEach((group: any) => {
      group.users = JSON.parse(group.users);
    });

    groups.map(async (group: any) => {
      await query({
        query: `UPDATE ${"`groups`"} SET users = "${JSON.stringify([
          ...group.users,
          user,
        ])}" WHERE id = ${group.id}`,
        values: [],
      });
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: [],
    });
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}