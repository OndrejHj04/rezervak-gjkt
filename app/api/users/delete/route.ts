import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { users } = await req.json();

    const data = (await query({
      query: `DELETE FROM users WHERE id IN (${users.join(",")})`,
      values: [],
    })) as any

    if (data.affectedRows === 0) throw new Error("No user found");

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
