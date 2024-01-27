import { query } from "@/lib/db";
import fetcher from "@/lib/fetcher";
import protect from "@/lib/protect";
import { NextResponse } from "next/server";

const eventId = 1;
export async function POST(req: Request) {
  try {
    const users = await req.json();

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

    const template = await fetcher(`/api/mailing/events/detail/${eventId}`, {
      token,
    });
    const emails = [] as any;
    const [data] = (await Promise.all([
      query({
        query: `INSERT INTO users (first_name, last_name, email, role, password, verified, active) VALUES ${users.map(
          (user: any) => {
            user.password = Math.random().toString(36).slice(-9);
            emails.push({ email: user.email, password: user.password });
            return `("${user.first_name}", "${user.last_name}", "${user.email}", "${user.role}", MD5("${user.password}"), 0, 1)`;
          }
        )}`,
        values: [],
      }),
    ])) as any;

    emails.map(async (user: any) => {
      await fetcher("/api/email", {
        method: "POST",
        body: JSON.stringify({
          send: template.data.active,
          to: user.email,
          template: template.data.template,
          variables: [
            { name: "email", value: user.email },
            { name: "password", value: user.password },
          ],
        }),
        token,
      });
    });

    return NextResponse.json({
      success: true,
      message: `${data.affectedRows} uživatelů úspěšně importováno`,
      data: [],
    });
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        message: "Něco se nepovedlo",
      },
      { status: 500 }
    );
  }
}
