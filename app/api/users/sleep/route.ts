import { query } from "@/lib/db";
import fetcher from "@/lib/fetcher";
import protect from "@/lib/protect";
import { template } from "lodash";
import { NextResponse } from "next/server";

const eventId = 3;
export async function POST(req: Request) {
  try {
    const { id, active } = await req.json();
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

    const [_, user] = (await Promise.all([
      query({
        query: `UPDATE users SET active = ? WHERE id = ?`,
        values: [!active, id],
      }),
      query({
        query: `SELECT email FROM users WHERE id = ?`,
        values: [id],
      }),
    ])) as any;

    const { data } = (await fetcher(`/api/mailing/events/detail/${eventId}`, {
      token,
    })) as any;

    await fetcher("/api/email", {
      method: "POST",
      token,
      body: JSON.stringify({
        send: data.active,
        to: user[0].email,
        template: data.template,
        variables: [{ name: "email", value: user[0].email }],
      }),
    });

    return NextResponse.json({
      success: true,
      message: "Active status updated",
      active: !active,
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
