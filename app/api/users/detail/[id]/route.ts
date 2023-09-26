import { query } from "@/lib/db";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const data = (await query({
      query: `
      SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.password,
      u.image,
      u.email,
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
      u.id = ?
    `,
      values: [id],
    })) as User[];

    data.map((item) => (item.role = JSON.parse(item.role as any)));

    if (data.length) {
      return NextResponse.json({
        success: true,
        message: "Operation successful",
        data: data[0],
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "User not found",
        data: [],
      });
    }
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
