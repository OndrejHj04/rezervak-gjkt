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
    const { templates } = await req.json();

    await Promise.all([
      query({
        query: `DELETE FROM templates WHERE id IN(${templates.map(() => "?")})`,
        values: [...templates],
      }),
      query({
        query: `UPDATE events_children SET template = 0, active = 0 WHERE template IN(${templates.map(
          () => "?"
        )})`,
        values: [...templates],
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
