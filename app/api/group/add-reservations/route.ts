import { query } from "@/lib/db";
import protect from "@/lib/protect";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { group, reservations } = await req.json();

    const placeholder = reservations.map(() => "(?,?,?)");
    const values = reservations.flatMap((res: any) => [
      res,
      group,
      [res, group].join(","),
    ]);

    (await Promise.all([
      query({
        query: `INSERT IGNORE INTO reservations_groups (reservationId, groupId, id) VALUES ${placeholder}`,
        values,
      }),
    ])) as any;

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: {
        count: reservations.length,
      },
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
