import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = Number(url.searchParams.get("id"));
  const page = Number(url.searchParams.get("page"));

  const [groups, data] = (await Promise.all([
    query({
      query: `SELECT * FROM GROUPS`,
    }),
    query({
      query: `SELECT * FROM GROUPS LIMIT 10 OFFSET ${page * 10 - 10}`,
    }),
  ])) as any;

  const filtered = groups.filter((item: any) => {
    const users = JSON.parse(item.users);
    if (users.includes(id) || item.owner === id) {
      return item;
    }
  });

  try {
    return NextResponse.json({
      success: true,
      message: "Operation successful",
      count: filtered.length,
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
