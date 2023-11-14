import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reservation, removeGroups, currentGroups } = await req.json();

    const getReservation = await query({
      query: `UPDATE reservations SET ${"`groups`"} = "${JSON.stringify(
        currentGroups.filter((group: any) => !removeGroups.includes(group))
      )}" WHERE id = ${reservation}`,
      values: [],
    });

    const groups = (await query({
      query: `SELECT id, reservations FROM ${"`groups`"} WHERE id IN (${removeGroups.join(
        ","
      )})`,
      values: [],
    })) as any;

    groups.forEach((group: any) => {
      group.reservations = JSON.parse(group.reservations);
    });

    groups.map(async (group: any) => {
      let newReservation = (group.reservations = group.reservations.filter(
        (res: any) => res !== reservation
      ));

      await query({
        query: `UPDATE ${"`groups`"} SET reservations = "${JSON.stringify(
          newReservation
        )}" WHERE id = ${group.id}`,
        values: [],
      });
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: groups,
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
