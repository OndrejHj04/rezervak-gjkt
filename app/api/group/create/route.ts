import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, description, owner, users } = await req.json();

    const data = await query({
      query: `INSERT INTO groups(name, description, owner, users) VALUES ("${name}","${description}", "${owner}", "${
        users || "[]"
      }")`,
      values: [],
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: data,
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
