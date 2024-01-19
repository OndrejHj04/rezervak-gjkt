import { query } from "@/lib/db";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const { ID_code, birth_date, newPassword, password, adress } =
      await req.json();

    const data = (await query({
      query: `UPDATE users SET password = MD5("${newPassword}"), ID_code = "${ID_code}", verified = 1, birth_date = "${birth_date}", adress = "${adress}" WHERE id = ${id} AND password = MD5("${password}")`, // verified = 1!! pak přidat
      values: [],
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
    })) as User[];

    const role = (await query({
      query: `SELECT * FROM roles WHERE id = ?`,
      values: [user[0].role],
    })) as any;

    user.map((item) => (item.role = role[0]));

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
