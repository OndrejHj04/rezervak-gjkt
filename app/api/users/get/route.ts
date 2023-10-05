import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // const url = new URL(req.url);
  // const roles = url.searchParams.get("roles")?.split(",");
  // const email = url.searchParams.get("email");
  
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

    data.map((item: any) => {
      item.role = JSON.parse(item.role as any);
      item.full_name = `${item.first_name} ${item.last_name}`;
      return item;
    });

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
