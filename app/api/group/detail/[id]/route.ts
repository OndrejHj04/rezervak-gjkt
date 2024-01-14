import { query } from "@/lib/db";
import { Group, GroupOwner } from "@/types";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const url = new URL(req.url);
    const rpage = Number(url.searchParams.get("reservations")) || 1;
    const upage = Number(url.searchParams.get("users")) || 1;

    const [group, reservations, resCount, users, usersCount] =
      (await Promise.all([
        query({
          query: `SELECT name, description, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email, 'image', users.image) as owner FROM groups INNER JOIN users ON users.id = groups.owner WHERE groups.id = ?`,
          values: [id],
        }),
        query({
          query: `SELECT from_date, to_date, name, status FROM reservations 
        INNER JOIN reservations_groups ON reservations.id = reservations_groups.reservationId 
        WHERE reservations_groups.groupId = ? LIMIT 10 OFFSET ?`,
          values: [id, rpage * 10 - 10],
        }),
        query({
          query: `SELECT COUNT(*) AS total FROM reservations_groups WHERE reservations_groups.groupId = ?`,
          values: [id],
        }),
        query({
          query: `SELECT first_name, last_name, email, image FROM users 
        INNER JOIN users_groups ON users.id = users_groups.userId 
        WHERE users_groups.groupId = ? LIMIT 10 OFFSET ?`,
          values: [id, upage * 10 - 10],
        }),
        query({
          query: `SELECT COUNT(*) AS total FROM users_groups WHERE users_groups.groupId = ?`,
          values: [id],
        }),
      ])) as any;

    group[0] = {
      ...group[0],
      owner: JSON.parse(group[0].owner),
      reservations: { data: reservations, count: resCount[0].total },
      users: { data: users, count: usersCount[0].total },
    };
    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: group[0],
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
