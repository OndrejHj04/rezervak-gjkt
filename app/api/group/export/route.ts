import { query } from "@/lib/db";
import protect from "@/lib/protect";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
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

    const groups = (await query({
      query: `SELECT groups.id, name, description, 
      CONCAT(users.first_name, ' ', users.last_name) as owner 
      FROM groups 
      INNER JOIN users ON users.id = groups.owner
      `,
    })) as any;

    const data = groups;

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data,
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
