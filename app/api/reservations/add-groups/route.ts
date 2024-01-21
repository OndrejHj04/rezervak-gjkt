import { query } from "@/lib/db";
import protect from "@/lib/protect";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reservation, groups } = await req.json();

    const isAuthorized = (await protect(
      req.headers.get("Authorization")
    )) as any;

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          message: "Auth failed",
        },
        { status: 500 }
      );
    }

    const values = groups.flatMap((group: any) => [
      reservation,
      group,
      [reservation, group].join(","),
    ]);

    const placeholder = groups.map(() => "(?,?,?)").join(", ");

    const [] = await Promise.all([
      query({
        query: `INSERT IGNORE INTO reservations_groups (reservationId, groupId, id) VALUES ${placeholder}`,
        values,
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
