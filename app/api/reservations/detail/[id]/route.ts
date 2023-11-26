import { query } from "@/lib/db";
import { Reservation } from "@/types";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  const url = new URL(req.url);
  const upage = Number(url.searchParams.get("users")) || 1;
  const gpage = Number(url.searchParams.get("groups")) || 1;

  try {
    const data = (await query({
      query: `SELECT * FROM reservations WHERE id = ?`,
      values: [id],
    })) as any;

    const [users, groups, status] = (await Promise.all([
      query({
        query: `SELECT id, first_name, last_name, image, email FROM users ${
          JSON.parse(data[0].users).length
            ? `WHERE id IN (${JSON.parse(data[0].users).join(",")})`
            : `WHERE 1=2`
        }`,
        values: [],
      }),
      query({
        query: `SELECT * FROM ${"`groups`"} ${
          JSON.parse(data[0].groups).length
            ? `WHERE id IN (${JSON.parse(data[0].groups).join(",")})`
            : `WHERE 1=2`
        }`,
        values: [],
      }),
      query({
        query: `SELECT * FROM status WHERE id = ?`,
        values: [data[0].status],
      }),
    ])) as any;

    data[0].users = {
      count: JSON.parse(data[0].users).length ? users.length : 0,
      data: JSON.parse(data[0].users).length
        ? users.slice((upage - 1) * 5, upage * 5)
        : [],
    };
    data[0].groups = {
      count: groups.length,
      data: groups.slice((gpage - 1) * 5, gpage * 5),
    };
    console.log(users);
    data[0].leader = users.find((user: any) => user.id === data[0].leader);
    data[0].status = status[0];

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: data[0],
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
