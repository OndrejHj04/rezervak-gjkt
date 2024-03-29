import { query } from "@/lib/db";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { mailEventDetail, sendEmail } from "@/lib/api";

const eventId = 4;
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const users = (await query({
      query: `SELECT  id, email FROM users WHERE email = ?`,
      values: [email],
    })) as any;
    if (users.length) {
      const tkn = sign(
        {
          exp: dayjs().add(1, "day").unix() * 1000,
          id: users[0].id,
        },
        "Kraljeliman"
      );

      const template = await mailEventDetail({ id: eventId });

      await sendEmail({
        send: template.data.active,
        to: email,
        template: template.data.template,
        variables: [
          {
            name: "link",
            value: `${process.env.NEXT_PUBLIC_API_URL}/password-reset/form?id=${users[0].id}&token=${tkn}`,
          },
        ],
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Something went wrong",
          email: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      email: true,
      data: { email },
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
