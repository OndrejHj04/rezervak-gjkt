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
      query: `SELECT
      u.*,
      JSON_OBJECT(
          'role_id', r.id,
          'role_name', r.role_name,
          'role_color', r.role_color
      ) AS role
  FROM
      users u
  JOIN
      roles r
  ON
      u.role = r.id
  WHERE
      u.id = ?`,
      values: [id],
    })) as User[];

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
