import { query } from "@/lib/db";
import { Group, GroupOwner } from "@/types";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  const data = (await query({
    query: `
        SELECT * FROM groups WHERE id = ?`,
    values: [id],
  })) as Group[];

  const owner = (await query({
    query: `
    SELECT id, image, first_name, last_name, email FROM users WHERE id = ?`,
    values: [data[0].owner],
  })) as GroupOwner[];

  data.map((item) => {
    item.owner = owner[0];
    item.users = item.users ? JSON.parse(item.users as any) : [];
    return item;
  });

  const members = (await query({
    query: `
    SELECT id, image, first_name, last_name, email FROM users WHERE id IN (${data[0].users.join()})`,
    values: [],
  })) as GroupOwner[];

  data[0].users = members;

  try {
    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: data[0],
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
