import { query } from "@/lib/db";
import GroupUsersEdit from "@/templates/groupUserEdit/template";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { user, newGroups, currentGroups } = await req.json();
    const [_, groups] = (await Promise.all([
      query({
        query: `UPDATE users SET ${"`groups`"} = "[${[
          ...currentGroups,
          ...newGroups,
        ]}]" WHERE id = ${user.id}`,
        values: [],
      }),
      query({
        query: `SELECT id, users, name, owner FROM ${"`groups`"} WHERE id IN (${newGroups.join(
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
      await Promise.all([
        query({
          query: `UPDATE ${"`groups`"} SET users = "${JSON.stringify([
            ...JSON.parse(group.users),
            user.id,
          ])}" WHERE id = ${group.id}`,
          values: [],
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email`, {
          method: "POST", 
          body: JSON.stringify({
            to: user.email,
            subject: "Přidání účtu do skupiny",
            html: GroupUsersEdit(
              {
                ...group,
                owner: users.find((user: any) => user.id === group.owner),
              },
              "add"
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
