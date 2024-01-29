import { query } from "@/lib/db";
import protect from "@/lib/protect";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
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

    const data = await req.json();
    const array = Object.entries(data);

    await query({
      query: `
              INSERT INTO events_children (id, active)
              VALUES ${array.map(
                (item) => `(${item[0].split(" ")[1]}, ${item[1]})`
              )}
              ON DUPLICATE KEY UPDATE id=VALUES(id),
              active=VALUES(active)
      `,
      values: [],
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
