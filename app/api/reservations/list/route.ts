import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const status = Number(url.searchParams.get("status"));
    const page = Number(url.searchParams.get("page"));
    const search = url.searchParams.get("search");
    const limit = Number(url.searchParams.get("limit")) || 10;
    const type = url.searchParams.get("type");
    const col = url.searchParams.get("col");
    const dir = url.searchParams.get("dir");
    const notStatus = Number(url.searchParams.get("not_status"));

    const [reservations, reservationsCount] = (await Promise.all([
      query({
        query: `
          SELECT from_date, to_date, reservations.name, purpouse, leader, status, creation_date,
          JSON_OBJECT('id', status.id, 'name', status.name, 'color', 'display_name', status.display_name, status.color, 'icon', status.icon) as status,
          JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email, 'image', users.image) as leader, 
          GROUP_CONCAT(DISTINCT groupId) as groups,
          GROUP_CONCAT(DISTINCT userId) as users
          FROM reservations
          INNER JOIN status ON status.id = reservations.status
          INNER JOIN users ON users.id = reservations.leader
          LEFT JOIN reservations_groups ON reservations_groups.reservationId = reservations.id
          LEFT JOIN users_reservations ON users_reservations.reservationId = reservations.id
          WHERE 1=1
          ${status ? `AND status.id = ${status}` : ""}
          ${search ? `AND reservations.name LIKE "%${search}%"` : ""}
          ${notStatus ? `AND status.id <> ${notStatus}` : ""}
          ${type === "expired" ? `AND to_date < CURDATE()` : ""}
          ${col && dir ? `ORDER BY ${col} ${dir.toUpperCase()}` : ""}
          GROUP BY reservations.id
          LIMIT ${limit || 10} OFFSET ${page * limit - limit}
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
        ${notStatus ? `AND status.id <> ${notStatus}` : ""}
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
