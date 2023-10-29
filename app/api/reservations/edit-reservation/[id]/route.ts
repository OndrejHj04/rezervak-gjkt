import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const { purpouse, rooms, instructions } = await req.json();

    const data = (await query({
      query: `UPDATE reservations SET purpouse = "${purpouse}", instructions = "${instructions}", rooms = ${rooms} WHERE id = ${id}`,
      values: [],
    })) as any;

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: [],
    });
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
