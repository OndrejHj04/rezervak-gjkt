import { mailEventDetail, sendEmail } from "@/lib/api";
import { query } from "@/lib/db";
import fetcher from "@/lib/fetcher";
import protect from "@/lib/protect";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

const eventId = 10;
export async function POST(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const { oldStatus, newStatus } = await req.json();
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

    const [reservation, _, { data }] = (await Promise.all([
      query({
        query: `SELECT reservations.from_date, reservations.status, reservations.name, reservations.to_date, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email) as leader,
        GROUP_CONCAT(distinct users.email) as emails FROM reservations LEFT JOIN users_reservations ON users_reservations.reservationId = reservations.id 
          INNER JOIN status ON status.id = reservations.status
          INNER JOIN users ON users_reservations.userId = users.id
          INNER JOIN users as leader ON leader.id = reservations.leader
         WHERE reservations.id = ? GROUP BY reservations.id`,
        values: [id],
      }),
      query({
        query: `UPDATE reservations SET status = ${newStatus} WHERE id = ${id}`,
        values: [],
      }),
      mailEventDetail({ id: eventId }),
    ])) as any;

    const statuses = (await query({
      query: `
        SELECT status.display_name FROM status WHERE id = ?
        UNION ALL
        SELECT status.display_name FROM status WHERE id = ?
      `,
      values: [oldStatus, newStatus],
    })) as any;

    const resDetail = {
      ...reservation[0],
      leader: JSON.parse(reservation[0].leader),
    };

    await sendEmail({
      send: data.active,
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
        { name: "status_before", value: statuses[0].display_name },
        { name: "status_new", value: statuses[1].display_name },
        { name: "leader_email", value: resDetail.leader.email },
        {
          name: "leader_name",
          value: resDetail.leader.first_name + " " + resDetail.leader.last_name,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: resDetail,
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
