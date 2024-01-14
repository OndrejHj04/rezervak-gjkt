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

    const reservation = (await query({
      query: `INSERT INTO reservations (from_date, to_date, rooms, purpouse, leader, instructions, name, status) VALUES ("${dayjs(
        from_date
      ).format("YYYY-MM-DD")}", "${dayjs(to_date).format(
        "YYYY-MM-DD"
      )}", "${rooms}", "${purpouse}", "${leader}", "${instructions}", "${name}", 2)`,
      values: [],
    })) as any;

    await Promise.all([
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
    ]);

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
