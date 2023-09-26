import { query } from "@/lib/db";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = (await query({
      query: `
      SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.password,
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
      r.id = 1;
    `,
      values: [],
    })) as User[];

    data.map((item) => (item.role = JSON.parse(item.role as any)));

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
