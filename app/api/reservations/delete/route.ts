import { query } from "@/lib/db";
import protect from "@/lib/protect";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reservations } = await req.json();

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

    const [] = await Promise.all([
      query({
        query: `DELETE FROM reservations WHERE id IN(${reservations.map(
          () => "?"
        )})`,
        values: [...reservations],
      }),
      query({
        query: `DELETE FROM reservations_groups WHERE reservationId IN(${reservations.map(
          () => "?"
        )})`,
        values: [...reservations],
      }),
      query({
        query: `DELETE FROM users_reservations WHERE reservationId IN(${reservations.map(
          () => "?"
        )})`,
        values: [...reservations],
      }),
      query({
        query: `DELETE FROM reservations_rooms WHERE reservationId IN(${reservations.map(
          () => "?"
        )})`,
        values: [...reservations],
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
        error: e,
      },
      { status: 500 }
    );
  }
}
