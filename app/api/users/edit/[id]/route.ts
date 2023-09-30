import { query } from "@/lib/db";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const user = await req.json();
    let str = "";
    Object.keys(user).forEach((key, i) => {
      str += `${key} = "${user[key]}"${
        Object.keys(user).length - 1 !== i ? ", " : ""
      }`;
    });
    console.log(`UPDATE users SET ${str} WHERE id = ${id}`)
    const data = (await query({
      query: `UPDATE users SET ${str} WHERE id = ${id}`,
      values: [],
    })) as User[] | any;

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
      },
      { status: 500 }
    );
  }
}
