import { query } from "@/lib/db";
import fetcher from "@/lib/fetcher";
import protect from "@/lib/protect";
import NewUserTemplate from "@/templates/userLogin/template";
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
        query: `INSERT INTO users(first_name, last_name, email, role, password, verified, active) VALUES("${first_name}", "${last_name}", "${email}", ${role}, MD5("${password}"), 0, 1)`,
        values: [first_name, last_name, email, role, password],
      }),
      fetcher(`/api/mailing/events/detail/${eventId}`, { token }),
    ])) as any;

    fetcher("/api/email", {
      method: "POST",
      body: JSON.stringify({
        to: email,
        template: data.template,
      }),
    });

    return NextResponse.json({
      success: true,
      message: `Uživatel ${first_name} ${last_name} byl úspěšně vytvořen.`,
      data: [],
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
