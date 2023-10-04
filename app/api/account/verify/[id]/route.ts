import { query } from "@/lib/db";
import { verifyForm } from "@/sub-components/VerifyUser";
import { verifyAccount } from "@/templates/store/verifyAccount";
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
      query: `UPDATE users SET password = "${newPassword}", ID_code = "${ID_code}", verified = 1, birth_date = "${birth_date}", adress = "${adress}" WHERE id = ${id} AND password = "${password}"`, // verified = 1!! pak přidat
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

    user.map((item) => (item.role = JSON.parse(item.role as any)));

    const email = await fetch("http://localhost:3000/api/send", {
      method: "POST",
      body: JSON.stringify({
        to: "ondra.hajku@seznam.cz", //user[0].email
        from: "onboarding@resend.dev",
        style: "public-send-password",
      }),
    });
    const make = await email.json();

    return NextResponse.json({
      mail: make,
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
