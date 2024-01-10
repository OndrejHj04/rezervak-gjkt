import { query } from "@/lib/db";
import GroupUsersEdit from "@/templates/groupUserEdit/template";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { currentMembers, group, membersForRemove } = await req.json();

    const [_, users] = (await Promise.all([
      query({
        query: `UPDATE ${"`groups`"} SET users = "${JSON.stringify(
          currentMembers.filter(
            (num: number) => !membersForRemove.includes(num)
          )
        )}" WHERE id = ${group.id}`,
        values: [],
      }),
      query({
        query: `SELECT * FROM users WHERE id IN(${membersForRemove.join(",")})`,
        values: [],
      }),
    ])) as any;

    users.map(async (user: any) => {
      await Promise.all([
        query({
          query: `UPDATE  users SET ${"`groups`"} = "${JSON.stringify([
            ...JSON.parse(user.groups).filter((grp: any) => grp !== group.id),
          ])}" WHERE id = ${user.id}`,
          values: [],
        }),

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email`, {
          method: "POST",
          body: JSON.stringify({
            to: user.email,
            subject: "Odstranění účtu ze skupiny",
            html: GroupUsersEdit(group, "remove"),
          }),
        }),
      ]);
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
        message: e.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
