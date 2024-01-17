import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = Number(url.searchParams.get("id"));

    const [reservations] = (await Promise.all([
      query({
        query: `SELECT reservations.id, from_date, to_date, status, reservations.name, leader, 
        JSON_OBJECT('id', status.id, 'name', status.name, 'color', 'display_name', status.display_name, status.color, 'icon', status.icon) as status,
        JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email, 'image', users.image) as leader,
        GROUP_CONCAT(
          DISTINCT JSON_OBJECT('id', rooms.id, 'people', rooms.people)
        ) as rooms
        FROM users_reservations 
        INNER JOIN reservations ON users_reservations.reservationId = reservations.id 
        INNER JOIN status ON status.id = reservations.status
        INNER JOIN reservations_rooms ON reservations.id = reservations_rooms.reservationId
        INNER JOIN rooms ON reservations_rooms.roomId = rooms.id
        INNER JOIN users ON users.id = reservations.leader
        WHERE userId = ?
        `,
        values: [id],
      }),
    ])) as any;

    const data = reservations.map((reservation: any) => ({
      ...reservation,
      status: JSON.parse(reservation.status),
      leader: JSON.parse(reservation.leader),
      rooms: JSON.parse(`[${reservations[0].rooms}]`),
    }));

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data,
      count: 5,
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
