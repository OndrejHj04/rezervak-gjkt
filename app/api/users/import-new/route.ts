import { query } from "@/lib/db";
import NewUserTemplate from "@/templates/userLogin/template";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const users = await req.json();

    const [data] = (await Promise.all([
      query({
        query: `INSERT INTO users (first_name, last_name, email, role, password, verified, active) VALUES ${users.map(
          (user: any) => {
            user.password = Math.random().toString(36).slice(-9);
            return `("${user.first_name}", "${user.last_name}", "${user.email}", "${user.role}", "${user.password}", 0, 1)`;
          }
        )}`,
        values: [],
      }),
    ])) as any;

    users.map((user: any) => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email`, {
        method: "POST",
        body: JSON.stringify({
          to: user.email,
          subject: "Nový účet",
          html: NewUserTemplate(user.email, user.password),
        }),
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
