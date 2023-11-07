import { query } from "@/lib/db";
import { Group } from "@/types";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("user_id");

    const data = (await query({
      query: `
        SELECT id, ${"`groups`"} from users WHERE id = "${userId}"
        `,
      values: [],
    })) as any;

    const userGroups = JSON.parse(data[0].groups);
    if (userGroups) {
      const getUserGroups = userGroups
        ? ((await query({
            query: `SELECT name, owner, id from ${"`groups`"} WHERE id IN (${userGroups.join(
              ","
            )})`,
            values: [],
          })) as any)
        : [];

      const ownerDetail = (await query({
        query: `
        SELECT id, first_name, last_name, image, email FROM users WHERE id IN (${getUserGroups.map(
          (group: any) => group.owner
        )})
        `,
        values: [],
      })) as any;

      getUserGroups.forEach((group: Group, index: number) => {
        group.owner = ownerDetail.find(
          (owner: any) => owner.id === group.owner
        );
      });

      return NextResponse.json({
        success: true,
        message: "Operation successful",
        data: getUserGroups,
      });
    }

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
