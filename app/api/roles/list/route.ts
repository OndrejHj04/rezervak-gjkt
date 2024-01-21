import { query } from "@/lib/db";
import { rolesConfig } from "@/rolesConfig";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const role = url.searchParams.get("role");

    if (!role) {
      const data = await query({
        query: `SELECT * FROM roles`,
      });
      return NextResponse.json({
        success: true,
        message: "Operation successful",
        data: data,
      });
    }
    
    const thisRoles = rolesConfig.users.modules.userCreate.options[
      role as never
    ] as any;

    if (thisRoles.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No roles found",
        data: [],
      });
    }

    const data = await query({
      query: `
      SELECT * FROM roles WHERE id IN(${thisRoles.map(() => "?")})
    `,
      values: [...thisRoles],
    });

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
