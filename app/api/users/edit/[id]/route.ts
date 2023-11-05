import { query } from "@/lib/db";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const user = await req.json();
    let str = "";
    Object.keys(user).forEach((key, i) => {
      str += `${key} = ${typeof user[key] === "string" ? "'" : ""}${user[key]}${
        typeof user[key] === "string" ? "'" : ""
      }${Object.keys(user).length - 1 !== i ? ", " : ""}`;
    });

    const data = (await query({
      query: `UPDATE users SET ${str} WHERE id = ${id}`,
      values: [],
    })) as User[] | any;

    const userDetail = (await query({
      query: `SELECT * FROM users WHERE id = ?`,
      values: [id],
    })) as User[];

    const roles = (await query({
      query: `SELECT * FROM roles WHERE id = ?`,
      values: [userDetail[0].role],
    })) as any;

    userDetail.map((item) => (item.role = JSON.parse(item.role as any)));

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: userDetail[0],
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
