import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import Papa from "papaparse";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const status = Number(url.searchParams.get("status"));

    const reservations = (await query({
      query: `SELECT * FROM reservations ${status ? "WHERE status = ?" : ""}`,
      values: [status],
    })) as any;
    const blob = new Blob([Papa.unparse(reservations)], { type: "text/csv" });
    return new Response(blob);
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
