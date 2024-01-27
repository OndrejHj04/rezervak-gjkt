import { query } from "@/lib/db";
import fetcher from "@/lib/fetcher";
import protect from "@/lib/protect";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

const eventId = 9;
export async function POST(req: Request) {
  try {
    const { reservation, users } = await req.json();
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
    const [_, { data }, usersEmails, reservationDetail] = (await Promise.all([
      query({
        query: `DELETE FROM users_reservations WHERE reservationId = ? AND userId IN(${users.map(
          () => "?"
        )})`,
        values: [reservation, ...users],
      }),
      fetcher(`/api/mailing/events/detail/${eventId}`, {
        token,
      }),
      query({
        query: `SELECT email FROM users WHERE id IN(${users.map(() => "?")})`,
        values: [...users],
      }),
      query({
        query: `SELECT reservations.from_date, reservations.to_date, status.display_name, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email) as leader 
        FROM reservations INNER JOIN users ON users.id = reservations.leader INNER JOIN status ON status.id = reservations.status WHERE reservations.id = ?`,
        values: [reservation],
      }),
    ])) as any;

    const res = {
      ...reservationDetail[0],
      leader: JSON.parse(reservationDetail[0].leader),
    };
    await fetcher("/api/email", {
      method: "POST",
      body: JSON.stringify({
        send: data.active,
        to: usersEmails.map(({ email }: { email: any }) => email),
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
          {
            name: "reservation_status",
            value: res.display_name,
          },
          {
            name: "leader_name",
            value: res.leader.first_name + " " + res.leader.last_name,
          },
          { name: "leader_email", value: res.leader.email },
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
