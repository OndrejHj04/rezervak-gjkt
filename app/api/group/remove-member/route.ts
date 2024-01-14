import { query } from "@/lib/db";
import GroupUsersEdit from "@/templates/groupUserEdit/template";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { group, members } = await req.json();

    const [groupDetail, users, owner, reservations] = (await Promise.all([
      query({
        query: `SELECT * FROM groups WHERE id = ?`,
        values: [group],
      }),
      query({
        query: `SELECT first_name, last_name, email FROM users WHERE id IN(${members.map(
          () => "?"
        )})`,
        values: [...members],
      }),
      query({
        query: `SELECT first_name, last_name, email FROM users INNER JOIN groups ON groups.owner = users.id WHERE groups.id = ?`,
        values: [group],
      }),
      query({
        query: `SELECT * FROM reservations INNER JOIN reservations_groups ON reservations.id = reservations_groups.groupId WHERE reservations_groups.groupId = ?`,
        values: [group],
      }),
      query({
        query: `DELETE FROM users_groups WHERE groupId = ? AND userId IN (${members.map(
          () => "?"
        )})`,
        values: [group, ...members],
      }),
    ])) as any;

    const data = { ...groupDetail[0], owner: owner[0], users, reservations };
    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data,
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
