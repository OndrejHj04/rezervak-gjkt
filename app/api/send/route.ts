import { verifyAccount } from "@/templates/store/verifyAccount";
import { templates } from "@/templates/templatesConfig";
import { NextResponse } from "next/server";
import { ReactNode } from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { from, to, style } = await req.json();

  const templateObj = templates(style);

  if (!templateObj) {
    return NextResponse.json({ error: "Invalid style" });
  }
  const { template, subject } = templateObj;

  try {
    const data = await resend.emails.send({
      from,
      to: [to],
      subject,
      react: template() as any,
      text: "",
    });

    return NextResponse.json({ data: "data" });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
