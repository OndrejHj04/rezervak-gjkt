import { query } from "@/lib/db";
import GroupUsersEdit from "@/templates/groupUserEdit/template";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { currentMembers, newMembers, group } = await req.json();

    const [_, users] = (await Promise.all([
      query({
        query: `UPDATE ${"`groups`"} SET users = "${JSON.stringify([
          ...currentMembers,
          ...newMembers,
        ])}" WHERE id = ${group.id}`,
        values: [],
      }),
      query({
        query: `SELECT * FROM users WHERE id IN (${newMembers.join(",")})`,
        values: [],
      }),
    ])) as any;

    users.map(async (user: any) => {
      await Promise.all([
        query({
          query: `UPDATE users SET ${"`groups`"} = "${JSON.stringify([
            ...JSON.parse(user.groups),
            group.id,
          ])}" WHERE id = ${user.id}`,
          values: [],
        }),

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email`, {
          method: "POST",
          body: JSON.stringify({
            to: user.email,
            subject: "Nová rezervace",
            html: GroupUsersEdit(
              { name: group.name, owner: group.owner },
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
