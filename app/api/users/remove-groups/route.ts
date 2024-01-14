import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { user, groups } = await req.json();

    await Promise.all([
      query({
        query: `DELETE FROM users_groups WHERE userId = ? AND groupId IN (${groups.map(
          () => "?"
        )})`,
        values: [user, ...groups],
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
