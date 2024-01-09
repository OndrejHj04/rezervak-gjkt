import { query } from "@/lib/db";
import { jaJP } from "@mui/x-date-pickers";
import { NextResponse } from "next/server";

export async function GET(req: any) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const data = (await query({
      query: `SELECT * FROM status ${type === "limit" ? "WHERE id <> 5" : ""}`,
      values: [],
    })) as any;

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
