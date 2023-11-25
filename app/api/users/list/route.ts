import { query } from "@/lib/db";
import { User as NextAuthUser } from "next-auth";
import { NextResponse } from "next/server";

interface User extends NextAuthUser {
  full_name: string;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const roles = url.searchParams.get("roles")?.split(",");
    const email = url.searchParams.get("email");

    const [rolesList, data] = (await Promise.all([
      query({
        query: `SELECT * FROM roles`,
        values: [],
      }),
      query({
        query: `SELECT * FROM users ${
          roles || email
            ? roles
              ? `WHERE role IN(${roles.join(",")})`
              : `WHERE email = "${email}"`
            : ``
        }`,
        values: [],
      }),
    ])) as any;

    data.map((item: any) => {
      item.role = rolesList.find((role: any) => role.id === Number(item.role));
      item.full_name = `${item.first_name} ${item.last_name}`;
      item.children = item.children ? JSON.parse(item.children as any) : [];
      return item;
    });
    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: data,
    });
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
        error: e,
      },
      { status: 500 }
    );
  }
}
