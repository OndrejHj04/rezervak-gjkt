import { query } from "@/lib/db";
import NewUserTemplate from "@/templates/userLogin/template";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { first_name, last_name, email, role } = await req.json();
  const password = Math.random().toString(36).slice(-9) as any;

  try {
    const data = await query({
      query: `INSERT INTO users(first_name, last_name, email, role, password, verified, active) VALUES("${first_name}", "${last_name}", "${email}", ${role}, "${password}", 0, 1)`,
      values: [first_name, last_name, email, role, password],
    });

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email`, {
      method: "POST",
      body: JSON.stringify({
        to: email,
        subject: "Nový účet",
        html: NewUserTemplate(email, password),
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
