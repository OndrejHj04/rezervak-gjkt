import { query } from "@/lib/db";
import protect from "@/lib/protect";
import { GroupOwner } from "@/types";
import { NextResponse } from "next/server";
import { decode } from "next-auth/jwt";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("Authorization") as any;
    const isAuthorized = (await protect(token)) as any;

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          message: "Auth failed",
        },
        { status: 500 }
      );
    }
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page"));
    const search = url.searchParams.get("search");
    const limit = url.searchParams.get("limit");

    const { role, id } = (await decode({
      token: token.replace("Bearer ", ""),
      secret: process.env.NEXTAUTH_SECRET as any,
    })) as any;
    const isLimited = role.id > 2;
    
    const [groups, reservations, users, count] = (await Promise.all([
      query({
        query: `
          SELECT groups.id, groups.name, description, JSON_OBJECT('id', users.id, 'first_name', users.first_name, 'last_name', users.last_name, 'email', users.email, 'image', users.image) AS owner, 
          GROUP_CONCAT(DISTINCT reservationId) AS reservations, GROUP_CONCAT(DISTINCT userId) AS users 
          FROM groups LEFT JOIN users ON users.id = owner LEFT JOIN users_groups ON users_groups.groupId = groups.id 
          LEFT JOIN reservations_groups ON reservations_groups.groupId = groups.id 
          LEFT JOIN reservations ON reservations.id = reservations_groups.groupId
          WHERE 1=1
          ${search ? `AND groups.name LIKE "%${search}%"` : ""}
          ${limit && isLimited ? `AND groups.owner = ${id}` : ""}
          GROUP BY groups.id
          ${page ? `LIMIT 10 OFFSET ${page * 10 - 10}` : ""}
        `,
        values: [],
      }),
      query({
        query: `SELECT id, from_date, to_date, name FROM reservations`,
        values: [],
      }),
      query({
        query: `SELECT first_name, last_name, email, id FROM users`,
        values: [],
      }),
      query({
        query: `
          SELECT COUNT(*) as total FROM groups
          WHERE 1=1
          ${search ? `AND groups.name LIKE "%${search}%"` : ""}
          ${limit && isLimited ? `AND groups.owner = ${id}` : ""}
        `,
        values: [],
      }),
    ])) as any;

    const data = groups.map((group: any) => {
      return {
        ...group,
        owner: JSON.parse(group.owner),
        reservations: group.reservations
          ? group.reservations
              .split(",")
              .map((res: any) =>
                reservations.find((r: any) => r.id === Number(res))
              )
          : [],
        users: group.users
          ? group.users
              .split(",")
              .map((u: any) => users.find((us: any) => Number(u) === us.id))
          : [],
      };
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: data,
      count: count[0].total,
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
