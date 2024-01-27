import { query } from "@/lib/db";
import fetcher from "@/lib/fetcher";
import protect from "@/lib/protect";
import { template, values } from "lodash";
import { NextResponse } from "next/server";

const eventId = 6;
export async function POST(req: Request) {
  try {
    const { user, groups } = await req.json();

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

    const [_, { data }, groupsDetail, userDetail] = (await Promise.all([
      query({
        query: `DELETE FROM users_groups WHERE userId = ? AND groupId IN (${groups.map(
          () => "?"
        )})`,
        values: [user, ...groups],
      }),
      fetcher(`/api/mailing/events/detail/${eventId}`, {
        token,
      }),
      query({
        query: `SELECT groups.name, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email) as owner
        FROM groups INNER JOIN users ON users.id = groups.owner WHERE groups.id IN(${groups.map(
          () => "?"
        )})`,
        values: [...groups],
      }),
      query({
        query: `SELECT email FROM users WHERE id = ?`,
        values: [user],
      }),
    ])) as any;

    groupsDetail.map((detail: any) => {
      detail = { ...detail, owner: JSON.parse(detail.owner) };

      fetcher("/api/email", {
        method: "POST",
        body: JSON.stringify({
          send: data.active,
          to: userDetail[0].email,
          template: data.template,
          variables: [
            { name: "group_name", value: detail.name },
            {
              name: "owner_name",
              value: detail.owner.first_name + " " + detail.owner.last_name,
            },
            { name: "owner_email", value: detail.owner.email },
          ],
        }),
        token,
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
