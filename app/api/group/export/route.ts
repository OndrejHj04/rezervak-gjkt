import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const groups = (await query({
      query: `SELECT groups.id, name, description, 
      CONCAT(users.first_name, ' ', users.last_name) as owner 
      FROM groups 
      INNER JOIN users ON users.id = groups.owner
      `,
    })) as any;

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: groups,
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
