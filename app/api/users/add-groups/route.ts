import { query } from "@/lib/db";
import fetcher from "@/lib/fetcher";
import protect from "@/lib/protect";
import { NextResponse } from "next/server";

const eventId = 5;
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

    const values = groups.flatMap((newGroup: any) => [
      user,
      newGroup,
      [user, newGroup].join(","),
    ]);

    const placeholders = groups.map(() => "(?,?,?)").join(",");

    const [_, userDetail, { data: template }, groupsData] = (await Promise.all([
      query({
        query: `INSERT IGNORE INTO users_groups (userId, groupId, id) VALUES ${placeholders}`,
        values,
      }),
      query({
        query: `SELECT email FROM users WHERE id = ?`,
        values: [user],
      }),
      fetcher(`/api/mailing/events/detail/${eventId}`, {
        token,
      }),
      query({
        query: `SELECT groups.name, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email) as owner, 
        COUNT(users_groups.groupId) as users
        FROM groups INNER JOIN users ON groups.owner = users.id 
        INNER JOIN users_groups ON groups.id = users_groups.groupId WHERE groups.id IN(${groups.map(
          () => "?"
        )}) GROUP BY groups.id`,
        values: groups,
      }),
    ])) as any;

    const data = groupsData.map(async (group: any) => {
      group = { ...group, owner: JSON.parse(group.owner) };

      await fetcher("/api/email", {
        method: "POST",
        body: JSON.stringify({
          send: template.active,
          to: userDetail[0].email,
          template: template.template,
          variables: [
            { name: "group_name", value: group.name },
            { name: "users_count", value: group.users },
            {
              name: "owner_name",
              value: group.owner.first_name + " " + group.owner.last_name,
            },
            { name: "owner_email", value: group.owner.email },
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
