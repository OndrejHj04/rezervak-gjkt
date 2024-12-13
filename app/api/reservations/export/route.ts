import { query } from "@/lib/db";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const reservations = (await query({
      query: `
SELECT 
    reservations.id, 
    from_date, 
    to_date, 
    CONCAT(users.first_name, ' ', users.last_name) AS leader,
    reservations.name, 
    CASE 
        WHEN u.id IS NULL THEN NULL
        ELSE GROUP_CONCAT(
            JSON_OBJECT(
                'jméno', CONCAT(u.first_name, ' ', u.last_name), 
                'datum narození', u.birth_date, 
                'organizace', o.name, 
                'rodičovský účet', CONCAT(p.first_name, ' ', p.last_name)
            ) SEPARATOR '|||'
        ) 
    END AS users 
FROM reservations
    LEFT JOIN users_reservations ur ON ur.reservationId = reservations.id
    LEFT JOIN users u ON u.id = ur.userId
    LEFT JOIN organization o ON o.id = u.organization
    LEFT JOIN users p ON p.email = u.email AND p.children = 0 AND p.id <> u.id
    LEFT JOIN users ON users.id = leader
GROUP BY reservations.id;
`,
    })) as any;


    const data = reservations.map((res: any) => ({
      ...res,
      from_date: dayjs(res.from_date).format("DD.MM.YYYY"),
      to_date: dayjs(res.to_date).format("DD.MM.YYYY"),
      creation_date: dayjs(res.creation_date).format("DD.MM.YYYY"),
      users: res.users ? res.users.split("|||").map((item: any) => JSON.parse(item)) : []
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
