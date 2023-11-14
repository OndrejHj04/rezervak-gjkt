import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reservation, newGroups, currentGroups } = await req.json();

    const getReservation = await query({
      query: `UPDATE reservations SET ${"`groups`"} = "[${[
        ...currentGroups,
        ...newGroups,
      ]}]" WHERE id = ${reservation}`,
      values: [],
    });

    const groups = (await query({
      query: `SELECT id, reservations FROM ${"`groups`"} WHERE id IN (${newGroups.join(
        ","
      )})`,
      values: [],
    })) as any;
    groups.forEach((group: any) => {
      group.reservations = JSON.parse(group.reservations);
    });

    groups.map(async (group: any) => {
      await query({
        query: `UPDATE ${"`groups`"} SET reservations = "${JSON.stringify([
          ...group.reservations,
          reservation,
        ])}" WHERE id = ${group.id}`,
        values: [],
      });
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: [],
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
