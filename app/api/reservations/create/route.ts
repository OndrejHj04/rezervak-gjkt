import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    //fromDate = YYYY-MM-DD
    //toDate = YYYY-MM-DD
    //leader = id
    //rooms = [id]
    //groups = [id]
    //purpouse = string
    //users = [id]
    //code = string

    const { fromDate, toDate, leader, rooms, groups, purpouse, users } =
      await req.json();

    const data = (await query({
      query: `INSERT INTO reservations (from_date, to_date, rooms, purpouse, leader, groups, users, code) VALUES ("${fromDate}", "${toDate}", "${rooms}", "${purpouse}", "${leader}", "${JSON.stringify(
        groups
      )}", "${JSON.stringify(users)}", "${Math.round(
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
