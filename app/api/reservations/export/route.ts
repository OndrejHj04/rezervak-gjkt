import { query } from "@/lib/db";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const reservations = (await query({
      query: `SELECT reservations.id, from_date, to_date, CONCAT(users.first_name, ' ', users.last_name) as leader,
      reservations.name, purpouse, instructions, status.display_name as status, creation_date 
      FROM reservations INNER JOIN status ON reservations.status = status.id
      INNER JOIN users ON users.id = leader
      `,
    })) as any;

    const data = reservations.map((res: any) => ({
      ...res,
      from_date: dayjs(res.from_date).format("DD.MM.YYYY"),
      to_date: dayjs(res.to_date).format("DD.MM.YYYY"),
      creation_date: dayjs(res.creation_date).format("DD.MM.YYYY"),
    }));

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data,
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
