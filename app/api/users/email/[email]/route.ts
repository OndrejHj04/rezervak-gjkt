import { query } from "@/lib/db";
import protect from "@/lib/protect";
import { NextResponse } from "next/server";

export async function GET(
  req: any,
  { params: { email } }: { params: { email: any } }
) {
  try {
    const [data, roles] = (await Promise.all([
      query({
        query: `
          SELECT users.*, JSON_OBJECT('id', roles.id, 'name', roles.name) as role FROM users INNER JOIN roles ON roles.id = users.role WHERE email = ?
      `,
        values: [email],
      }),
    ])) as any;

    if (!data.length) {
      return NextResponse.json({
        success: true,
        message: "No user found",
        data: [],
      });
    }

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: [{ ...data[0], role: JSON.parse(data[0].role) }],
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
