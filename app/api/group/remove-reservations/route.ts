import { query } from "@/lib/db";
import protect from "@/lib/protect";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { group, reservations } = await req.json();



    await Promise.all([
      query({
        query: `DELETE FROM reservations_groups WHERE groupId = ? AND reservationId IN (${reservations.map(
          () => "?"
        )})`,
        values: [group, ...reservations],
      }),
    ]);
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
