import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: any,
  { params: { email } }: { params: { email: any } }
) {
  try {
    const [data, roles] = (await Promise.all([
      query({
        query: `
        SELECT * FROM users WHERE email = ?
      `,
        values: [email],
      }),
      query({
        query: `
        SELECT * FROM roles
      `,
        values: [],
      }),
    ])) as any;

    data[0].role = roles.find((r: any) => r.id === Number(data[0].role));
    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: data,
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
