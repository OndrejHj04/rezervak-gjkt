import { transporter } from "@/lib/email";
import MakeEmailText from "@/lib/makeEmailText";
import protect from "@/lib/protect";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { to, template, variables } = await req.json();

    const isAuthorized = (await protect(
      req.headers.get("Authorization")
    )) as any;

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          message: "Auth failed",
        },
        { status: 500 }
      );
    }

    await transporter.sendMail({
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
