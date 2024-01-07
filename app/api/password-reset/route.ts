import { query } from "@/lib/db";
import ResetPasswordTemplate from "@/templates/resetPassword/template";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  try {
    const { email } = await req.json();

    const checkAccount = (await query({
      query: `SELECT email, password FROM users WHERE email = "${email}"`,
    })) as any;

    if (!checkAccount.length) {
      return NextResponse.json({ success: false, message: "user not found" });
    }

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email`, {
      method: "POST",
      body: JSON.stringify({
        to: email,
        subject: "Obnovení hesla",
        html: ResetPasswordTemplate(checkAccount[0]),
      }),
    });
    return NextResponse.json({
      success: true,
      message: "Operation successful",
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
