import { query } from "@/lib/db";
import fetcher from "@/lib/fetcher";
import protect from "@/lib/protect";
import { NextResponse } from "next/server";

const eventId = 1;
export async function POST(req: Request) {
  try {
    const { first_name, last_name, email, role } = await req.json();
    const password = Math.random().toString(36).slice(-9) as any;
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

    const check = (await query({
      query: `SELECT * FROM users WHERE email = ?`,
      values: [email],
    })) as any;

    if (check.length) {
      return NextResponse.json(
        {
          success: false,
          duplicate: true,
          message: "Something went wrong",
        },
        { status: 500 }
      );
    }

    const [_, { data }] = (await Promise.all([
      query({
        query: `INSERT INTO users(first_name, last_name, email, role, password, verified, active) VALUES(?,?,?,?, MD5(?), 0, 1)`,
        values: [first_name, last_name, email, role, password],
      }),
      fetcher(`/api/mailing/events/detail/${eventId}`, { token }),
    ])) as any;

    fetcher("/api/email", {
      method: "POST",
      body: JSON.stringify({
        send: data.active,
        to: email,
        template: data.template,
        variables: [
          { name: "email", value: email },
          { name: "password", value: password },
        ],
      }),
      token,
    });

    return NextResponse.json({
      success: true,
      message: `Uživatel ${first_name} ${last_name} byl úspěšně vytvořen.`,
      data: [],
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        success: false,
        message: e.message,
      },
      { status: 500 }
    );
  }
}
