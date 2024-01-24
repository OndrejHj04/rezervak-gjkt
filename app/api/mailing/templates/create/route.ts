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
    const { name, text, title } = await req.json();

    await query({
      query: `
      INSERT INTO templates (name, text, title) VALUES (?,?,?)
    `,
      values: [name, text, title],
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: { title },
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
