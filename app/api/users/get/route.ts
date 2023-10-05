import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const data = (await query({
      query: `SELECT u.*, CONCAT('{', 
      '"role_id":', r.id, ',',
      '"role_name":"', r.role_name, '",',
      '"role_color":"', r.role_color, '",',
      '"icon":"', r.icon, '"',
      '}') AS role 
    FROM users u 
    JOIN roles r ON u.role = r.id`,
      values: [],
    })) as any;

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: data,
    });
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
      data: null,
    });
  }
}
