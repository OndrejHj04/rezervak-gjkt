import { query } from "@/lib/db";
import { Reservation } from "@/types";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const url = new URL(req.url);
    const upage = Number(url.searchParams.get("users")) || 1;
    const gpage = Number(url.searchParams.get("groups")) || 1;

    const [reservations, users, usersCount, groups, groupsCount] =
      (await Promise.all([
        query({
          query: `SELECT reservations.id, from_date, to_date, reservations.name, leader, instructions, purpouse, rooms, creation_date, 
        JSON_OBJECT('id', status.id, 'name', status.name, 'color', status.color, 'display_name', display_name, 'icon', icon) as status, 
        JSON_OBJECT('id', users.id, 'first_name', users.first_name, 'last_name', users.last_name, 'email', users.email, 'image', users.image) as leader
        FROM reservations
        INNER JOIN status ON reservations.status = status.id
        INNER JOIN users ON users.id = reservations.leader
        WHERE reservations.id = ?`,
          values: [id],
        }),
        query({
          query: `SELECT users.id, first_name, last_name, image, email FROM users_reservations INNER JOIN users ON users.id = userId WHERE reservationId = ? LIMIT 10 OFFSET ?`,
          values: [id, upage * 10 - 10],
        }),
        query({
          query: `SELECT COUNT(*) as total FROM users_reservations WHERE reservationId = ?`,
          values: [id],
        }),
        query({
          query: `
            SELECT groups.id, groups.name, description, GROUP_CONCAT(DISTINCT userId) as users
            FROM reservations_groups
            INNER JOIN groups ON reservations_groups.groupId = groups.id
            LEFT JOIN users_groups ON groups.id = users_groups.groupId
            WHERE reservationId = ?
            GROUP BY groups.id
            LIMIT 10 OFFSET ?
            `,
          values: [id, gpage * 10 - 10],
        }),
        query({
          query: `SELECT COUNT(*) as total FROM reservations_groups WHERE reservationId = ?`,
          values: [id],
        }),
      ])) as any;

    const data = reservations.length && {
      ...reservations[0],
      status: JSON.parse(reservations[0].status),
      leader: JSON.parse(reservations[0].leader),
      users: {
        data: users,
        count: usersCount[0].total,
      },
      groups: {
        data: groups.map((group: any) => ({
          ...group,
          users: group.users ? group.users.split(",") : [],
        })),
        count: groupsCount[0].total,
      },
    };

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data,
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
