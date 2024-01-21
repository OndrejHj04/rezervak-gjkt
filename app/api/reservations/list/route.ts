import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextApiRequest, NextApiResponse } from "next";
import protect from "@/lib/protect";

export async function GET(req: Request, res: any) {
  try {
    const isAuthorized = (await protect(
      req.headers.get("Authorization")
    )) as any;

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
    const status = Number(url.searchParams.get("status"));
    const page = Number(url.searchParams.get("page"));
    const search = url.searchParams.get("search");
    const limit = Number(url.searchParams.get("limit")) || 10;
    const type = url.searchParams.get("type");
    const col = url.searchParams.get("col");
    const dir = url.searchParams.get("dir");
    const notStatus = url.searchParams.get("not_status")?.split(",");

    const [reservations, reservationsCount] = (await Promise.all([
      query({
        query: `
          SELECT reservations.id, from_date, to_date, reservations.name, purpouse, leader, status, creation_date,
          JSON_OBJECT('id', status.id, 'name', status.name, 'color', status.color, 'display_name', status.display_name, 'icon', status.icon) as status,
          JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email, 'image', users.image) as leader, 
          GROUP_CONCAT(
              DISTINCT groups.name
            ) as groups,
          GROUP_CONCAT(DISTINCT userId) as users,
          GROUP_CONCAT(
            DISTINCT JSON_OBJECT('id', rooms.id, 'people', rooms.people)
          ) as rooms
          FROM reservations
          INNER JOIN status ON status.id = reservations.status
          INNER JOIN users ON users.id = reservations.leader
          LEFT JOIN reservations_rooms ON reservations_rooms.reservationId = reservations.id
          LEFT JOIN rooms ON rooms.id = reservations_rooms.roomId
          LEFT JOIN reservations_groups ON reservations_groups.reservationId = reservations.id
          LEFT JOIN groups ON reservations_groups.groupId = groups.id 
          LEFT JOIN users_reservations ON users_reservations.reservationId = reservations.id
          WHERE 1=1
          ${status ? `AND status.id = ${status}` : ""}
          ${search ? `AND reservations.name LIKE "%${search}%"` : ""}
          ${
            notStatus?.length
              ? notStatus
                  .map((stat: any) => `AND status.id <> ${stat}`)
                  .join(" ")
              : ""
          }
          ${type === "expired" ? `AND to_date < CURDATE()` : ""}
          ${col && dir ? `ORDER BY ${col} ${dir.toUpperCase()}` : ""}
          GROUP BY reservations.id
          ${page ? `LIMIT ${limit || 10} OFFSET ${page * limit - limit}` : ""}
        `,
        values: [],
      }),
      query({
        query: `
        SELECT COUNT(*) as total FROM reservations
        INNER JOIN status ON reservations.status = status.id
        WHERE 1=1
        ${status ? `AND status.id = ${status}` : ""}
        ${search ? `AND reservations.name LIKE "%${search}%"` : ""}
        ${
          notStatus?.length
            ? notStatus.map((stat: any) => `AND status.id <> ${stat}`).join(" ")
            : ""
        }
        ${type === "expired" ? `AND to_date < CURDATE()` : ""}
        `,
        values: [],
      }),
    ])) as any;

    const data = reservations.map((reservation: any) => ({
      ...reservation,
      leader: JSON.parse(reservation.leader),
      status: JSON.parse(reservation.status),
      groups: reservation.groups ? reservation.groups.split(",") : [],
      users: reservation.users ? reservation.users.split(",") : [],
      rooms: JSON.parse(`[${reservation.rooms}]`).filter(
        ({ id }: { id: any }) => id
      ),
    }));

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data,
      count: reservationsCount[0].total,
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        success: false,
        message: e.message || "Something went wrong",
        error: e,
      },
      { status: 500 }
    );
  }
}
