import { query } from "@/lib/db";
import fetcher from "@/lib/fetcher";
import protect from "@/lib/protect";
import dayjs from "dayjs";
import { values } from "lodash";
import { NextResponse } from "next/server";

const eventId = 10;
export async function POST(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const { status } = await req.json();
    const token = req.headers.get("Authorization");
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

    const [reservation, _, newStatus, { data }] = (await Promise.all([
      query({
        query: `SELECT reservations.from_date, reservations.name, reservations.to_date, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email) as leader,
        GROUP_CONCAT(distinct users.email) as emails, status.display_name as status_before FROM reservations LEFT JOIN users_reservations ON users_reservations.reservationId = reservations.id 
          INNER JOIN users as leader ON leader.id = users_reservations.userId
          INNER JOIN status ON status.id = reservations.status
          INNER JOIN users ON reservations.leader = users.id
         WHERE reservations.id = ? GROUP BY reservations.id`,
        values: [id],
      }),
      query({
        query: `UPDATE reservations SET status = ${status} WHERE id = ${id}`,
        values: [],
      }),
      query({
        query: `SELECT status.display_name as status_new FROM status WHERE id = ?`,
        values: [status],
      }),
      fetcher(`/api/mailing/events/detail/${eventId}`, {
        token,
      }),
    ])) as any;

    const resDetail = {
      ...reservation[0],
      status_new: newStatus[0].status_new,
      leader: JSON.parse(reservation[0].leader),
    };

    await fetcher("/api/email", {
      method: "POST",
      body: JSON.stringify({
        to: resDetail.emails.split(","),
        template: data.template,
        variables: [
          {
            name: "reservation_name",
            value: resDetail.name,
          },
          {
            name: "reservation_start",
            value: dayjs(resDetail.from_date).format("DD.MM.YYYY"),
          },
          {
            name: "reservation_end",
            value: dayjs(resDetail.to_date).format("DD.MM.YYYY"),
          },
          { name: "status_before", value: resDetail.status_before },
          { name: "status_new", value: resDetail.status_new },
          { name: "leader_email", value: resDetail.leader.email },
          {
            name: "leader_name",
            value:
              resDetail.leader.first_name + " " + resDetail.leader.last_name,
          },
        ],
      }),
      token,
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: [],
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
