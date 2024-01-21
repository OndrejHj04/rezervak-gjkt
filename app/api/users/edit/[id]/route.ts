import { query } from "@/lib/db";
import protect from "@/lib/protect";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const user = await req.json();
    let str = "";

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

    Object.keys(user).forEach((key, i) => {
      str += `${key} = ${user[key] ? "'" : ""}${
        Number(user[key]) || user[key].length ? user[key] : null
      }${user[key] ? "'" : ""}${
        Object.keys(user).length - 1 !== i ? ", " : ""
      }`;
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
