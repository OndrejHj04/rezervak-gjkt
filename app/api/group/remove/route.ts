import { query } from "@/lib/db";
import GroupUsersEdit from "@/templates/groupUserEdit/template";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { groups } = await req.json();

    const [allGroups, _] = (await Promise.all([
      query({
        query: `
        SELECT groups.name, groups.description, JSON_OBJECT('first_name', owner.first_name, 'last_name', owner.last_name, 'email', owner.email) as owner, GROUP_CONCAT(users.email) as users 
        FROM groups 
        INNER JOIN users_groups ON users_groups.groupId = groups.id 
        INNER JOIN users ON users.id = users_groups.userId 
        INNER JOIN users AS owner ON owner.id = groups.owner 
        WHERE groups.id IN(${groups.map(() => "?")}) 
        GROUP BY groups.id`,
        values: [...groups],
      }),
      query({
        query: `DELETE FROM groups WHERE id IN(${groups.map(() => "?")})`,
        values: [...groups],
      }),
      query({
        query: `DELETE FROM users_groups WHERE groupId IN(${groups.map(
          () => "?"
        )})`,
        values: [...groups],
      }),
      query({
        query: `DELETE FROM reservations_groups WHERE groupId IN(${groups.map(
          () => "?"
        )})`,
        values: [...groups],
      }),
    ])) as any;

    allGroups.map((group: any) => {
      const emails = new Set([
        JSON.parse(group.owner).email,
        ...group.users.split(","),
      ]);
      //fetch(email)
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
