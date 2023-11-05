import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const { name, description } = await req.json();

    const data = (await query({
      query: `
        UPDATE ${"`groups`"} SET name = ?, description = ? WHERE id = ?`,
      values: [name, description, id],
    })) as any;

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
