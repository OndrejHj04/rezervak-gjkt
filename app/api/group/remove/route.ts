import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { groups } = await req.json();

  const data = await query({
    query: `DELETE FROM groups WHERE id IN (${groups.join(",")});`,
    values: [],
  });

  try {
    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: [],
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        success: false,
        message: e.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
