import { query } from "@/lib/db";
import protect from "@/lib/protect";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { users } = await req.json();

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

    const [emails] = await Promise.all([
      query({
        query: `SELECT email FROM users WHERE id IN(${users.map(() => "?")})`,
        values: [...users],
      }),
      query({
        query: `DELETE FROM users WHERE id IN(${users.map(() => "?")})`,
        values: [...users],
      }),
      query({
        query: `DELETE FROM users_groups WHERE userId IN(${users.map(
          () => "?"
        )})`,
        values: [...users],
      }),
      query({
        query: `DELETE FROM users_reservations WHERE userId IN(${users.map(
          () => "?"
        )})`,
        values: [...users],
      }),
    ]);

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
