import { transporter } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { to, subject, html } = await req.json();

  //await transporter.sendMail({
  //  from: process.env.EMAIL_ADRESS,
  //  to,
  //  subject,
  //  html,
  // });

  return NextResponse.json({
    success: true,
    message: "Operation successful",
    data: [],
  });
}
