import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { from_date, to_date, leader, rooms, groups, purpouse, members } =
      await req.json();

    const data = (await query({
      query: `INSERT INTO reservations (from_date, to_date, rooms, purpouse, leader, groups, users, code) VALUES ("${from_date}", "${to_date}", "${rooms}", "${purpouse}", "${leader}", "${JSON.stringify(
        groups
      )}", "${JSON.stringify(members)}", "${Math.round(
        Math.random() * 1000000
      )}")`,
      values: [],
    })) as any;

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: [],
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
