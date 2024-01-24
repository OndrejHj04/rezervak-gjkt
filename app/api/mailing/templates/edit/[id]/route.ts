import { query } from "@/lib/db";
import protect from "@/lib/protect";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params: { id } }: { params: { id: any } }
) {
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
      UPDATE templates SET name = ?, title = ?, text = ? WHERE id = ?
    `,
      values: [name,title, text, id],
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
