import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const count = (await query({
      query: `
               SELECT count FROM numbers WHERE id = 1
              `,
      values: [],
    })) as any;

    const makeCount = await query({
      query: `
        UPDATE numbers SET count = ${count[0].count + 1} WHERE id = 1
       `,
      values: [],
    });
    revalidatePath("user/list");
    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: count,
    });
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: "Fail",
    });
  }
}
