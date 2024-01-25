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
    for (let i = 0; i < Object.keys(data).length / 2; i++) {
      const [first, second] = Object.keys(data).slice(i * 2, i * 2 + 2) as any;
      const rowId = first.replace("Checkbox ", "");
      const checkSecond = data[second] ? data[second].id : null;

      await query({
        query: `UPDATE events_children SET active = ?, template = ? WHERE id = ?`,
        values: [data[first], checkSecond, rowId],
      });
    }

    await query({
      query: ``,
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
