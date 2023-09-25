import { query } from "@/lib/db";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file = data.get("file") as File;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const image = await query({
    query: `
    UPDATE users SET profile_picture = ? WHERE id = 1;
  `,
    values: [buffer],
  });

  return NextResponse.json({ success: true });
}
