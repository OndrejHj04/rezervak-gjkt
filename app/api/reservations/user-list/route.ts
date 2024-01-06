import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = Number(url.searchParams.get("id"));
  const page = Number(url.searchParams.get("page"));

  const [reservations] = (await Promise.all([
    query({
      query: `SELECT * FROM reservations`,
    }),
  ])) as any;

  const filtered = reservations.filter((item: any) => {
    const users = JSON.parse(item.users);
    if (users.includes(id) || item.leader === id) {
      return item;
    }
  });

  try {
    return NextResponse.json({
      success: true,
      message: "Operation successful",
      count: filtered.length,
      data: filtered.slice((page - 1) * 5, page * 5),
    });
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
        error: e,
      },
      { status: 500 }
    );
  }
}
