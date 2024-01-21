import { query } from "@/lib/db";
import protect from "@/lib/protect";
import { NextResponse } from "next/server";

export async function POST(req: any) {
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
    const { data } = await req.json();
    const validData = data.filter((item: any) =>
      item.every((row: any) => row.length)
    );
    const value = (await query({
      query: `SELECT email FROM users WHERE email IN (${validData
        .map((item: any) => `"${item[2]}"`)
        .join(",")})`,
    })) as any;
    const set = new Set();
    value.map((item: any) => {
      set.add(item.email);
    });
    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: validData.map((valid: any) => {
        return [...valid, !set.has(valid[2])];
      }),
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
