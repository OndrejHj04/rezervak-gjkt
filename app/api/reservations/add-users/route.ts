import { query } from "@/lib/db";
import fetcher from "@/lib/fetcher";
import protect from "@/lib/protect";
import dayjs from "dayjs";
import { template } from "lodash";
import { NextResponse } from "next/server";

const eventId = 8;
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

    const values = users.flatMap((user: any) => [
      user,
      reservation,
      [user, reservation].join(","),
    ]);

    const placeholder = users.map(() => "(?,?,?)").join(", ");

    const [_, { data }, reservationDetail, usersEmails] = (await Promise.all([
      query({
        query: `INSERT IGNORE INTO users_reservations (userId, reservationId, id) VALUES ${placeholder}`,
        values,
      }),
      fetcher(`/api/mailing/events/detail/${eventId}`, {
        token,
      }),
      query({
        query: `SELECT reservations.from_date, reservations.to_date, status.display_name, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email) as owner 
        FROM reservations INNER JOIN users ON users.id = reservations.leader INNER JOIN status ON status.id = reservations.status WHERE reservations.id = ?`,
        values: [reservation],
      }),
      query({
        query: `SELECT email FROM users WHERE id IN(${users.map(() => "?")})`,
        values: [...users],
      }),
    ])) as any;

    const res = {
      ...reservationDetail[0],
      owner: JSON.parse(reservationDetail[0].owner),
    };

    await fetcher("/api/email", {
      method: "POST",
      body: JSON.stringify({
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
          { name: "reservation_status", value: res.display_name },
          {
            name: "leader_name",
            value: res.owner.first_name + " " + res.owner.last_name,
          },
          { name: "leader_email", value: res.owner.email },
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
