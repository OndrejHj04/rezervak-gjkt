import { query } from "@/lib/db";
import GroupUsersEdit from "@/templates/groupUserEdit/template";
import { group } from "console";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { group } = await req.json();

    const [groupDetail, _] = (await Promise.all([
      query({
        query: `SELECT * FROM ${"`groups`"} WHERE id = ${group}`,
        values: [],
      }),
      query({
        query: `DELETE FROM ${"`groups`"} WHERE id = ${group}`,
        values: [],
      }),
    ])) as any;
    const owner = (await query({
      query: `SELECT * FROM users WHERE id = ${groupDetail[0].owner}`,
      values: [],
    })) as any;

    const groupUsers = JSON.parse(groupDetail[0].users).length
      ? await query({
          query: `SELECT * FROM users WHERE id IN(${JSON.parse(
            groupDetail[0].users
          ).join(",")})`,
          values: [],
        })
      : ([] as any);

    const groupReservations = JSON.parse(groupDetail[0].reservations).length
      ? await query({
          query: `SELECT * FROM reservations WHERE id IN(${JSON.parse(
            groupDetail[0].reservations
          ).join(",")})`,
          values: [],
        })
      : ([] as any);

    groupReservations.map(async (res: any) => {
      const reservationGroups = JSON.parse(res.groups).filter(
        (r: any) => r !== group
      );
      await query({
        query: `UPDATE reservations SET ${"`groups`"} = "${JSON.stringify(
          reservationGroups
        )}" WHERE id = ${res.id}`,
        values: [],
      });
    });

    groupUsers.map(async (u: any) => {
      const userGroups = JSON.parse(u.groups).filter(
        (grp: any) => grp !== group
      );
      await Promise.all([
        query({
          query: `UPDATE users SET ${"`groups`"} = "${JSON.stringify(
            userGroups
          )}" WHERE id = ${u.id}`,
          values: [],
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email`, {
          method: "POST",
          body: JSON.stringify({
            to: u.email,
            subject: "Odstranění účtu ze skupiny",
            html: GroupUsersEdit(
              { name: groupDetail[0].name, owner: owner[0] },
              "remove"
            ),
          }),
        }),
      ]);
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: [],
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
