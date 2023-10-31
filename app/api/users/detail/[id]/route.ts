import { query } from "@/lib/db";
import { group } from "console";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const data = (await query({
      query: `
      SELECT
      u.*,
      JSON_OBJECT(
          'role_id', r.id,
          'role_name', r.role_name,
          'role_color', r.role_color
      ) AS role
  FROM
      users u
  JOIN
      roles r
  ON
      u.role = r.id
  WHERE
      u.id = ?
    `,
      values: [id],
    })) as any;

    data.map((item: any) => {
      item.role = JSON.parse(item.role as any);
      item.groups = JSON.parse(item.groups as any);
      item.reservations = JSON.parse(item.reservations as any);
    });

    if (data[0].groups.length) {
      const groups = (await query({
        query: `SELECT id, name, owner, users FROM groups WHERE id IN (${data[0].groups.join(
          ","
        )})`,
        values: [],
      })) as any;

      const owner = (await query({
        query: `SELECT id, first_name, last_name FROM users WHERE id IN (${groups
          .map((group: any) => group.owner)
          .join(",")})`,
        values: [],
      })) as any;
      groups.map((group: any) => {
        group.users = JSON.parse(group.users);
      });
      groups.find((group: any) => {
        return (group.owner = owner.find(
          (user: any) => user.id === group.owner
        ));
      });
      data[0].groups = groups;
    }

    if (data[0].reservations) {
      const reservations = await query({
        query: `SELECT id, from_date, to_date, name FROM reservations WHERE id IN (${data[0].reservations.join(
          ","
        )})`,
        values: [],
      });

      data[0].reservations = reservations;
    }

    if (data.length) {
      return NextResponse.json({
        success: true,
        message: "Operation successful",
        data: data[0],
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "User not found",
        data: null,
      });
    }
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
