import { query } from "@/lib/db";
import protect from "@/lib/protect";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { id } }: { params: { id: any } }
) {
  try {
    const isAuthorized = (await protect(
      req.headers.get("Authorization")
    )) as any;

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          message: "Auth failed",
        },
        { status: 500 }
      );
    }

    const templates = (await query({
      query: `
          SELECT templates.id, templates.name, templates.title, templates.text, events_children.variables 
          FROM templates 
          INNER JOIN events_children ON events_children.template = templates.id
          WHERE templates.id = ?
    `,
      values: [id],
    })) as any;
    const data = {
      ...templates[0],
      variables: templates[0].variables.split(","),
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
