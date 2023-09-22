import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const roles = url.searchParams.get("roles")?.split(",");
    const email = url.searchParams.get("email");
    const placeholders = roles?.map((role) => "?").join(", ") || 0;

    let sql = "SELECT * FROM users";
    let values = [];
    if (roles) {
      sql = `SELECT * FROM users ${
        placeholders ? `WHERE role IN (${placeholders})` : ""
      }`;
      values = roles;
    } else if (email) {
      sql = `SELECT * FROM users WHERE email = ?`;
      values = [email];
    }

    const data = await query({
      query: sql,
      values: values,
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
