import { query } from "@/lib/db";
import GroupUsersEdit from "@/templates/groupUserEdit/template";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { newMembers, group } = await req.json();

    const values = newMembers.flatMap((newMember: any) => [
      newMember,
      group,
      [newMember, group].join(","),
    ]);

    const placeholders = newMembers.map(() => "(?,?,?)").join(", ");

    const [_, groupDetail, owner, users, reservations] = (await Promise.all([
      query({
        query: `INSERT IGNORE INTO users_groups (userId, groupId, id) VALUES ${placeholders}`,
        values,
      }),
      query({
        query: `SELECT groups.* FROM groups WHERE groups.id = ?`,
        values: [group],
      }),
      query({
        query: `SELECT first_name, last_name, email FROM users INNER JOIN groups ON groups.owner = users.id WHERE groups.id = ?`,
        values: [group],
      }),
      query({
        query: `SELECT first_name, last_name, email FROM users WHERE id IN(${newMembers.map(
          () => "?"
        )})`,
        values: [...newMembers],
      }),
      query({
        query: `SELECT reservations.* FROM reservations INNER JOIN reservations_groups ON reservations.id = reservations_groups.reservationId`,
        values: [],
      }),
    ])) as any;

    const data = {
      ...groupDetail[0],
      owner: owner[0],
      users,
      reservations,
    };

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email`, {
      method: "POST",
      body: JSON.stringify({
        to: users.map(({ email }: { email: any }) => email),
        subject: "Přidání účtu do rezervace",
        html: GroupUsersEdit(groupDetail, users, reservations),
      }),
    });

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: data,
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
