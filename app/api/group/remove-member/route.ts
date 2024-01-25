import { query } from "@/lib/db";
import fetcher from "@/lib/fetcher";
import protect from "@/lib/protect";
import { NextResponse } from "next/server";

const eventId = 6;
export async function POST(req: Request) {
  try {
    const { group, members } = await req.json();

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

    const [groupDetail, users, owner, reservations, _, template] =
      (await Promise.all([
        query({
          query: `SELECT * FROM groups WHERE id = ?`,
          values: [group],
        }),
        query({
          query: `SELECT first_name, last_name, email FROM users WHERE id IN(${members.map(
            () => "?"
          )})`,
          values: [...members],
        }),
        query({
          query: `SELECT first_name, last_name, email FROM users INNER JOIN groups ON groups.owner = users.id WHERE groups.id = ?`,
          values: [group],
        }),
        query({
          query: `SELECT * FROM reservations INNER JOIN reservations_groups ON reservations.id = reservations_groups.groupId WHERE reservations_groups.groupId = ?`,
          values: [group],
        }),
        query({
          query: `DELETE FROM users_groups WHERE groupId = ? AND userId IN (${members.map(
            () => "?"
          )})`,
          values: [group, ...members],
        }),
        fetcher(`/api/mailing/events/detail/${eventId}`, {
          token,
        }),
      ])) as any;

    const data = { ...groupDetail[0], owner: owner[0], users, reservations };

    await fetcher("/api/email", {
      method: "POST",
      body: JSON.stringify({
        to: users.map(({ email }: { email: any }) => email),
        template: template.data.template,
        variables: [
          { name: "group_name", value: groupDetail[0].name },
          {
            name: "owner_name",
            value: owner[0].first_name + " " + owner[0].last_name,
          },
          { name: "owner_email", value: owner[0].email },
        ],
      }),
      token,
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data,
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        success: false,
        message: e.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
