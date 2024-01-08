import { query } from "@/lib/db";
import NewReservationMember from "@/templates/reservationUserEdit/template";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

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

    const [data, resLeader] = (await Promise.all([
      query({
        query: `INSERT INTO reservations (from_date, to_date, rooms, purpouse, leader, ${"`groups`"}, users, code, instructions, name, status) VALUES ("${dayjs(
          from_date
        ).format("YYYY-MM-DD")}", "${dayjs(to_date).format(
          "YYYY-MM-DD"
        )}", "${rooms}", "${purpouse}", "${leader}", "${JSON.stringify(
          groups
        )}", "${JSON.stringify(members)}", "${Math.round(
          Math.random() * 1000000
        )}", "${instructions}", "${name}", 2)`,
        values: [],
      }),
      query({
        query: `SELECT id, email, first_name, last_name FROM users WHERE id = ${leader}`,
        values: [],
      }),
    ])) as any;

    if (groups.length) {
      const groupReservations = (await query({
        query: `SELECT id, reservations FROM ${"`groups`"} WHERE id IN (${groups.join(
          ","
        )})`,
        values: [],
      })) as any;

      groupReservations.map(async (group: any) => {
        const reservations = group.reservations
          ? JSON.parse(group.reservations)
          : [];
        reservations.push(data.insertId);
        await query({
          query: `UPDATE ${"`groups`"} SET reservations = "${JSON.stringify(
            reservations
          )}" WHERE id = ${group.id}`,
          values: [],
        });
      });
    }

    if (members.length) {
      const userReservations = (await query({
        query: `SELECT id, reservations, email  FROM users WHERE id IN (${members.join(
          ","
        )})`,
        values: [],
      })) as any;
      userReservations.map(async (user: any) => {
        const reservations = user.reservations
          ? JSON.parse(user.reservations)
          : [];
        reservations.push(data.insertId);
        await Promise.all([
          query({
            query: `UPDATE users SET reservations = "${JSON.stringify(
              reservations
            )}" WHERE id = ${user.id}`,
            values: [],
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email`, {
            method: "POST",
            body: JSON.stringify({
              to: user.email,
              subject: "Přidání účtu do rezervace",
              html: NewReservationMember(
                { from_date, to_date, leader: resLeader[0], instructions },
                "add"
              ),
            }),
          }),
        ]);
      });
    }

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: [],
    });
  } catch (e: any) {
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
