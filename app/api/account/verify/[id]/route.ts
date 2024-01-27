import { query } from "@/lib/db";
import fetcher from "@/lib/fetcher";
import protect from "@/lib/protect";
import { User } from "next-auth";
import { NextResponse } from "next/server";

const eventId = 2;
export async function POST(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const token = req.headers.get("Authorization");
    const isAuthorized = (await protect(token)) as any;

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          message: "Auth failed",
        },
        { status: 500 }
      );
    }

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

    const [user, template] = (await Promise.all([
      query({
        query: `SELECT * FROM users WHERE id = ?`,
        values: [id],
      }),
      fetcher(`/api/mailing/events/detail/${eventId}`, { token }),
    ])) as any;

    fetcher("/api/email", {
      method: "POST",
      body: JSON.stringify({
        send: template.data.active,
        to: user[0].email,
        template: template.data.template,
        variables: [{ name: "email", value: user[0].email }],
      }),
      token,
    });

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
