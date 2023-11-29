import { query } from "@/lib/db";
import { group } from "console";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  const url = new URL(req.url);
  const rpage = Number(url.searchParams.get("reservations")) || 1;
  const gpage = Number(url.searchParams.get("groups")) || 1;

  try {
    const data = (await query({
      query: `
      SELECT * FROM users WHERE id = ?
    `,
      values: [id],
    })) as any;

    const [role, groups, reservations] = (await Promise.all([
      query({
        query: `
        SELECT * FROM roles WHERE id = ${data[0].role}
      `,
        values: [],
      }),
      query({
        query: `
        SELECT * FROM ${"`groups`"} ${
          JSON.parse(data[0].groups).length
            ? `WHERE id IN (${JSON.parse(data[0].groups).join(",")})`
            : `WHERE 1=2`
        }
      `,
        values: [],
      }),
      query({
        query: `
        SELECT * FROM reservations ${
          JSON.parse(data[0].reservations).length
            ? `WHERE id IN (${JSON.parse(data[0].reservations).join(",")})`
            : `WHERE 1=2`
        }
      `,
        values: [JSON.parse(data[0].reservations).join(",")],
      }),
    ])) as any;

    data[0].role = role[0];
    data[0].groups = {
      count: groups.length,
      data: groups.slice((gpage - 1) * 5, gpage * 5),
    };
    data[0].reservations = {
      count: reservations.length,
      data: reservations.slice((rpage - 1) * 5, rpage * 5),
    };

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
