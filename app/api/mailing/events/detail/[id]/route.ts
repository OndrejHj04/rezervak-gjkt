import { query } from "@/lib/db";
import protect from "@/lib/protect";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const event = (await query({
      query: `
        SELECT events_children.id, primary_txt, secondary_txt, active, variables,
        JSON_OBJECT('id', templates.id, 'name', templates.name, 'title', templates.title, 'text', templates.text) as template 
        FROM events_children LEFT JOIN templates ON templates.id = events_children.template WHERE events_children.id = ?
    `,
      values: [id],
    })) as any;

    const data = {
      ...event[0],
      template: JSON.parse(event[0].template),
      variables: event[0].variables.split(","),
    };

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data,
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
