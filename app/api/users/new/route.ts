import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { first_name, last_name, email, role } = await req.json();

  try {
    const data = await query({
      query: `INSERT INTO users(first_name, last_name, email, role) VALUES(?, ?, ?, ?)`,
      values: [first_name, last_name, email, role],
    });

    return NextResponse.json({
      success: true,
      message: `Uživatel ${first_name} ${last_name} byl úspěšně vytvořen.`,
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
