import { publicSendPassword } from "@/templates/publicSendPassword";
import { NextResponse } from "next/server";
import { ReactNode } from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["ondra.hajku@seznam.cz"],
      subject: "Hello world",
      react: publicSendPassword({ firstName: "John" }) as ReactNode,
      text: "",
    });
    return NextResponse.json({ data: data });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
