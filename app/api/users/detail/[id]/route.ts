import { query } from "@/lib/db";
import { group } from "console";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const url = new URL(req.url);
    const rpage = Number(url.searchParams.get("reservations")) || 1;
    const gpage = Number(url.searchParams.get("groups")) || 1;

    const [user, groups, groupsCount, reservations, reservationsCount] =
      (await Promise.all([
        query({
          query: `SELECT users.id, first_name, image, last_name, email, active, verified, adress, ID_code, JSON_OBJECT('id', roles.id, 'name', roles.name) as role FROM users INNER JOIN roles ON roles.id = users.role WHERE users.id = ?`,
          values: [id],
        }),
        query({
          query: `
          SELECT groups.id, groups.name, groups.description, 
          JSON_OBJECT('id', owner.id, 'first_name', owner.first_name, 'last_name', owner.last_name, 'email', owner.email) as owner,
          GROUP_CONCAT(users_groups.userId) as users
          FROM users_groups
          INNER JOIN groups ON users_groups.groupId = groups.id 
          INNER JOIN users AS owner ON owner.id = groups.owner
          WHERE groups.id IN (
            SELECT groupId FROM users_groups WHERE userId = ?
          )
          GROUP BY groups.id
          LIMIT 5 OFFSET ?
        `,
          values: [id, gpage * 5 - 5],
        }),
        query({
          query: `SELECT COUNT(*) as total FROM users_groups WHERE userId = ?`,
          values: [id],
        }),
        query({
          query: `SELECT reservations.id, from_date, to_date, reservations.name, JSON_OBJECT('id', users.id, 'first_name', first_name, 'last_name', last_name, 'email', email, 'image', image) as leader, JSON_OBJECT('name', status.name, 'color', status.color, 'display_name', status.display_name, 'icon', status.icon) as status
          FROM users_reservations
          INNER JOIN reservations ON reservations.id = users_reservations.reservationId
          INNER JOIN users ON users.id = reservations.leader
          INNER JOIN status ON status.id = reservations.status
          WHERE userId = ? LIMIT 5 OFFSET ?`,
          values: [id, rpage * 5 - 5],
        }),
        query({
          query: `SELECT COUNT(*) as total FROM users_reservations WHERE userId = ?`,
          values: [id],
        }),
      ])) as any;

    const data = {
      ...user[0],
      role: JSON.parse(user[0].role),
      reservations: {
        data: reservations.map((res: any) => ({
          ...res,
          leader: JSON.parse(res.leader),
          status: JSON.parse(res.status),
        })),
        count: reservationsCount[0].total,
      },
      groups: {
        data: groups.map((group: any) => ({
          ...group,
          owner: JSON.parse(group.owner),
          users: group.users.split(","),
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
