import { sendEmail } from "@/lib/api";
import { query } from "@/lib/db";
import fetcher from "@/lib/fetcher";
import protect from "@/lib/protect";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

const eventId = 8;
export async function POST(req: Request) {
  try {
    const { user, reservations } = await req.json();
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

    const values = reservations.flatMap((newReservation: any) => [
      user,
      newReservation,
      [user, newReservation].join(","),
    ]);

    const placeholders = reservations.map(() => "(?,?,?)").join(",");

    const [_, { data }, userDetail, reservationsDetail] = (await Promise.all([
      query({
        query: `INSERT IGNORE INTO users_reservations (userId, reservationId, id) VALUES ${placeholders}`,
        values,
      }),
      fetcher(`/api/mailing/events/detail/${eventId}`, {
        token,
      }),
      query({
        query: `SELECT email FROM users WHERE id = ?`,
        values: [user],
      }),
      query({
        query: `SELECT reservations.from_date, reservations.to_date, status.display_name, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email) as owner 
        FROM reservations INNER JOIN users ON users.id = reservations.leader INNER JOIN status ON status.id = reservations.status WHERE reservations.id IN(${reservations.map(
          () => "?"
        )})`,
        values: [...reservations],
      }),
    ])) as any;

    reservationsDetail.map(async (res: any) => {
      res = { ...res, owner: JSON.parse(res.owner) };

      await sendEmail({
        send: data.active,
        to: userDetail[0].email,
        template: data.template,
        variables: [
          {
            name: "reservation_start",
            value: dayjs(res.from_date).format("DD.MM.YYYY"),
          },
          {
            name: "reservation_end",
            value: dayjs(res.to_date).format("DD.MM.YYYY"),
          },
          { name: "reservation_status", value: res.display_name },
          {
            name: "leader_name",
            value: res.owner.first_name + " " + res.owner.last_name,
          },
          { name: "leader_email", value: res.owner.email },
        ],
      });
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
