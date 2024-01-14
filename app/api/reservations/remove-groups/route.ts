import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reservation, groups } = await req.json();

    const [] = await Promise.all([
      query({
        query: `DELETE FROM reservations_groups WHERE reservationId = ? AND groupId IN(${groups.map(
          () => "?"
        )})`,
        values: [reservation, ...groups],
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
