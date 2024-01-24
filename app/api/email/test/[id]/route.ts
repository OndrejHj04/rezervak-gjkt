import { transporter } from "@/lib/email";
import fetcher from "@/lib/fetcher";
import protect from "@/lib/protect";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params: { id } }: { params: { id: any } }
) {
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

  const { data } = await fetcher(`/api/mailing/templates/detail/${id}`, {
    token,
  });

  await transporter.sendMail({
    from: process.env.EMAIL_ADRESS,
    to: "ondra.hajku@seznam.cz",
    subject: data.title,
    html: data.text,
  });

  return NextResponse.json({
    success: true,
    message: "Operation successful",
    data: [],
  });
}
