import { sendEmail } from "@/lib/api";
import { query } from "@/lib/db";
import fetcher from "@/lib/fetcher";
import protect from "@/lib/protect";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

const eventId = 8;
export async function POST(req: Request) {
  try {
    const {
      from_date,
      to_date,
      leader,
      rooms,
      groups,
      purpouse,
      members,
      instructions,
      name,
    } = await req.json();

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

    const reservation = (await query({
      query: `INSERT INTO reservations (from_date, to_date, purpouse, leader, instructions, name, status, creation_date)
      VALUES ("${dayjs(from_date).format("YYYY-MM-DD")}", "${dayjs(
        to_date
      ).format(
        "YYYY-MM-DD"
      )}", "${purpouse}", "${leader}", "${instructions}", "${name}", 2, "${dayjs(
        new Date()
      ).format("YYYY-MM-DD")}")`,
      values: [],
    })) as any;

    const [{ data }, leaderData, statusName, membersEmail] = (await Promise.all(
      [
        fetcher(`/api/mailing/events/detail/${eventId}`, {
          token,
        }),
        query({
          query: `SELECT first_name, last_name, email FROM users WHERE id = ?`,
          values: [leader],
        }),
        query({
          query: `SELECT display_name FROM status WHERE id = 2`,
        }),
        query({
          query: `SELECT email FROM users WHERE id IN(${members.map(
            () => "?"
          )})`,
          values: [...members],
        }),
        query({
          query: `INSERT INTO reservations_rooms (reservationId, roomId, id) VALUES ${rooms.map(
            () => "(?,?,?)"
          )}`,
          values: rooms.flatMap((room: any) => [
            reservation.insertId,
            room,
            [room, reservation.insertId].join(","),
          ]),
        }),
        members.length &&
          query({
            query: `INSERT INTO users_reservations (userId, reservationId, id) VALUES ${members
              .map(() => "(?,?,?)")
              .join(", ")}`,
            values: members.flatMap((member: any) => [
              member,
              reservation.insertId,
              [member, reservation.insertId].join(","),
            ]),
          }),
        groups.length &&
          query({
            query: `INSERT INTO reservations_groups (reservationId, groupId, id) VALUES ${groups
              .map(() => "(?,?,?)")
              .join(", ")}`,
            values: groups.flatMap((group: any) => [
              reservation.insertId,
              group,
              [group, reservation.insertId].join(","),
            ]),
          }),
      ]
    )) as any;

    await sendEmail({
      send: data.active,
      to: membersEmail.map(({ email }: { email: any }) => email),
      template: data.template,
      variables: [
        {
          name: "reservation_start",
          value: dayjs(from_date).format("DD.MM.YYYY"),
        },
        {
          name: "reservation_end",
          value: dayjs(to_date).format("DD.MM.YYYY"),
        },
        { name: "reservation_status", value: statusName[0].display_name },
        {
          name: "leader_name",
          value: leaderData[0].first_name + " " + leaderData[0].last_name,
        },
        { name: "leader_email", value: leaderData[0].email },
      ],
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: [],
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
