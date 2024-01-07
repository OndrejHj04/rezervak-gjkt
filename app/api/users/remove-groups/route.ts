import { query } from "@/lib/db";
import GroupUsersEdit from "@/templates/groupUserEdit/template";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { user, currentGroups, removeGroups } = await req.json();

    const [_, groups] = (await Promise.all([
      query({
        query: `UPDATE users SET ${"`groups`"} = "${JSON.stringify(
          currentGroups.filter((group: any) => !removeGroups.includes(group))
        )}" WHERE id = ${user.id}`,
        values: [],
      }),

      query({
        query: `SELECT * FROM ${"`groups`"} WHERE id IN (${removeGroups.join(
          ","
        )})`,
        values: [],
      }),
    ])) as any;

    const users = (await query({
      query: `SELECT id, first_name, last_name, email FROM users WHERE id IN (${groups
        .map((res: any) => res.owner)
        .join(",")})`,
      values: [],
    })) as any;

    groups.map(async (group: any) => {
      group.users = JSON.parse(group.users);
      let newUsers = (group.users = group.users.filter(
        (res: any) => res !== user.id
      ));
      await Promise.all([
        query({
          query: `UPDATE ${"`groups`"} SET users = "${JSON.stringify(
            newUsers
          )}" WHERE id = ${group.id}`,
          values: [],
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email`, {
          method: "POST",
          body: JSON.stringify({
            to: user.email,
            subject: "Nová skupina",
            html: GroupUsersEdit(
              {
                ...group,
                owner: users.find((user: any) => user.id === group.owner),
              },
              "remove"
            ),
          }),
        }),
      ]);
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
