import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { users } = await req.json();

    const data = (await query({
      query: `SELECT * FROM users WHERE id IN (${users.join(",")})`,
      values: [],
    })) as any;

    const groups = new Set(
      [].concat(...data.map((item: any) => JSON.parse(item.groups)))
    );

    const reservations = new Set(
      [].concat(...data.map((item: any) => JSON.parse(item.reservations)))
    );

    if (groups.size) {
      const groupData = (await query({
        query: `SELECT * FROM ${"`groups`"} WHERE id IN (${Array.from(
          groups
        ).join(",")})`,
        values: [],
      })) as any;

      groupData.map(async (grp: any) => {
        const newUsers = JSON.parse(grp.users).filter(
          (id: any) => !users.includes(id)
        );
        await query({
          query: `UPDATE ${"`groups`"} SET users = "${JSON.stringify(
            newUsers
          )}" WHERE id = ${grp.id}`,
          values: [],
        });
      });
    }

    if (reservations.size) {
      const reservationData = (await query({
        query: `SELECT * FROM reservations WHERE id IN (${Array.from(
          reservations
        ).join(",")})`,
        values: [],
      })) as any;

      reservationData.map(async (res: any) => {
        const newUsers = JSON.parse(res.users).filter(
          (id: any) => !users.includes(id)
        );
        await query({
          query: `UPDATE reservations SET users = "${JSON.stringify(
            newUsers
          )}" WHERE id = ${res.id}`,
          values: [],
        });
      });
    }

    (await query({
      query: `DELETE FROM users WHERE id IN(${users.join(",")})`,
      values: [],
    })) as any;

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: data,
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
