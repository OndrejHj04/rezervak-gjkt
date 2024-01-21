import { query } from "@/lib/db";
import protect from "@/lib/protect";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { user, groups } = await req.json();

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

    const values = groups.flatMap((newGroup: any) => [
      user,
      newGroup,
      [user, newGroup].join(","),
    ]);

    const placeholders = groups.map(() => "(?,?,?)").join(",");

    await Promise.all([
      query({
        query: `INSERT IGNORE INTO users_groups (userId, groupId, id) VALUES ${placeholders}`,
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
