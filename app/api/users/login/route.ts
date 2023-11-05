import { query } from "@/lib/db";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("WELCOME!");
  try {
    console.log(req, "request");
    const { email, password } = await req.json();
    console.log(email, password, "credentials");
    console.log("USER-CREDENTIALS", email, password);
    const data = (await query({
      query: `SELECT * FROM users WHERE email = "${email}" AND password = ${password}`,
      values: [],
    })) as User[];

    if (data.length) {
      const roles = (await query({
        query: `SELECT * FROM roles WHERE id = ?`,
        values: [data[0].role],
      })) as any;

      data.map((item) => (item.role = roles[0]));
    }

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: data[0],
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
