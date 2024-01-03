import { query } from "@/lib/db";
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

    const data = (await query({
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
    })) as any;

    if (groups.length) {
      const groupReservations = (await query({
        query: `SELECT id, reservations FROM ${"`groups`"} WHERE id IN (${groups.join(
          ","
        )})`,
        values: [],
      })) as any;

      groupReservations.map((group: any) => {
        const reservations = group.reservations
          ? JSON.parse(group.reservations)
          : [];
        reservations.push(data.insertId);
        query({
          query: `UPDATE ${"`groups`"} SET reservations = "${JSON.stringify(
            reservations
          )}" WHERE id = ${group.id}`,
          values: [],
        });
      });
    }

    if (members.length) {
      const userReservations = (await query({
        query: `SELECT id, reservations FROM users WHERE id IN (${members.join(
          ","
        )})`,
        values: [],
      })) as any;
      userReservations.map((user: any) => {
        const reservations = user.reservations
          ? JSON.parse(user.reservations)
          : [];
        reservations.push(data.insertId);

        query({
          query: `UPDATE users SET reservations = "${JSON.stringify(
            reservations
          )}" WHERE id = ${user.id}`,
          values: [],
        });
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
