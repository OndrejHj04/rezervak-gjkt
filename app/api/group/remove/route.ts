import { query } from "@/lib/db";
import fetcher from "@/lib/fetcher";
import protect from "@/lib/protect";
import { NextResponse } from "next/server";

const eventId = 7;
export async function POST(req: Request) {
  try {
    const { groups } = await req.json();

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
    const [{ data }, allGroups, _] = (await Promise.all([
      fetcher(`/api/mailing/events/detail/${eventId}`, {
        token,
      }),
      query({
        query: `
        SELECT groups.name, groups.description, JSON_OBJECT('first_name', owner.first_name, 'last_name', owner.last_name, 'email', owner.email) as owner, GROUP_CONCAT(users.email) as users 
        FROM groups 
        LEFT JOIN users_groups ON users_groups.groupId = groups.id 
        INNER JOIN users ON users.id = users_groups.userId 
        INNER JOIN users AS owner ON owner.id = groups.owner 
        WHERE groups.id IN(${groups.map(() => "?")}) 
        GROUP BY groups.id`,
        values: [...groups],
      }),
    ])) as any;

    allGroups.map(async (grp: any) => {
      grp = { ...grp, owner: JSON.parse(grp.owner) };
      await fetcher("/api/email", {
        method: "POST",
        body: JSON.stringify({
          send: data.active,
          to: grp.users.split(","),
          template: data.template,
          variables: [
            { name: "group_name", value: grp.name },
            {
              name: "owner_name",
              value: grp.owner.first_name + " " + grp.owner.last_name,
            },
            { name: "owner_email", value: grp.owner.email },
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
  } catch (e: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
