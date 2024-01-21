import { query } from "@/lib/db";
import protect from "@/lib/protect";
import { NextResponse } from "next/server";

export async function GET(
  req: any,
  { params: { email } }: { params: { email: any } }
) {
  try {
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
    const [data, roles] = (await Promise.all([
      query({
        query: `
      SELECT * FROM users WHERE email = "${email}"
      `,
        values: [],
      }),
      query({
        query: `
        SELECT * FROM roles
      `,
        values: [],
      }),
    ])) as any;

    if (!data.length) {
      return NextResponse.json({
        success: true,
        message: "No user found",
        data: [],
      });
    }

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
