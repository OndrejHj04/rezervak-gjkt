import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { groups } = await req.json();

    const [userGroups, reservationGroups] = (await Promise.all([
      await query({
        query: `SELECT id, ${"`groups`"} FROM users`,
        values: [],
      }),
      await query({
        query: `SELECT id, ${"`groups`"} FROM reservations`,
        values: [],
      }),
    ])) as any;

    groups.map(async (group: any) => {
      userGroups.map(async (user: any) => {
        let groupsData = JSON.parse(user.groups);

        if (groupsData.includes(group)) {
          groupsData = groupsData.filter((num: number) => num !== group);
          await query({
            query: `UPDATE users SET ${"`groups`"} = "${JSON.stringify(
              groupsData
            )}" WHERE id = "${user.id}"`,
            values: [],
          });
        }
      });

      reservationGroups.map(async (reservation: any) => {
        let reservationData = JSON.parse(reservation.groups);

        if (reservationData.includes(group)) {
          reservationData = reservationData.filter((num: any) => num !== group);
          await query({
            query: `UPDATE reservations SET ${"`groups`"} = "${JSON.stringify(
              reservationData
            )}" WHERE id = "${reservation.id}"`,
            values: [],
          });
        }
      });
    });

    const data = await query({
      query: `DELETE FROM ${"`groups`"} WHERE id IN (${groups.join(",")})`,
      values: [],
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
