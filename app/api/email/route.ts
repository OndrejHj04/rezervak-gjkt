import { transporter } from "@/lib/email";
import MakeEmailText from "@/lib/makeEmailText";
import protect from "@/lib/protect";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { send, to, template, variables, check = true } = await req.json();

    const isAuthorized = (await protect(
      req.headers.get("Authorization")
    )) as any;

    if (!isAuthorized && check) {
      return NextResponse.json(
        {
          success: false,
          message: "Auth failed",
        },
        { status: 500 }
      );
    }

    if (!send) {
      return NextResponse.json({
        success: true,
        message: "Email send is forbidden.",
      });
    }

    const mail = await transporter.sendMail({
      from: process.env.EMAIL_ADRESS,
      to,
      subject: template.title,
      html: MakeEmailText(template.text, variables),
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
