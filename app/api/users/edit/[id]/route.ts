import { query } from "@/lib/db";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const { password, newPassword } = await req.json();

    const data = (await query({
      query: `UPDATE users SET password = ?, verified = 1 WHERE id = ? AND password = ?`,
      values: [newPassword, id, password],
    })) as User[] | any;

    if (data.affectedRows === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Password incorrect",
        },
        { status: 500 }
      );
    }
    
    const user = (await query({
      query: `SELECT * FROM users WHERE id = ?`,
      values: [id],
    })) as User[]

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: user[0],
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
