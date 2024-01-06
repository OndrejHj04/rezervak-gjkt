import { transporter } from "@/lib/email";
import NewUserTemplate from "@/templates/userLogin/template";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await transporter.sendMail({
    from: process.env.EMAIL_ADRESS,
    to: "ondra.hajku@seznam.cz",
    subject: "test",
    html: NewUserTemplate("ondra.hajku@seznam.cz", "test"),
  });

  return NextResponse.json({
    success: true,
    message: "Operation successful",
    data: [],
  });
}
