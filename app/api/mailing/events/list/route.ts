import { query } from "@/lib/db";
import protect from "@/lib/protect";
import { rolesConfig } from "@/rolesConfig";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
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

    const events = (await query({
      query: `
        SELECT events.id, events.name,
        GROUP_CONCAT(
          JSON_OBJECT('id', events_children.id, 'primary_txt', events_children.primary_txt,
          'secondary_txt', events_children.secondary_txt, 'template', 
          IF(templates.id IS NULL, NULL, JSON_OBJECT('id', templates.id, 'name', templates.name, 'title', templates.title, 'text', templates.text)),
          'active', events_children.active)
        ) as children
        FROM events INNER JOIN events_children ON events_children.event = events.id
        LEFT JOIN templates ON templates.id = events_children.template
        GROUP BY events.id
    `,
      values: [],
    })) as any;

    const data = events.map((item: any) => ({
      ...item,
      children: JSON.parse(`[${item.children}]`).map((child: any) => ({
        ...child,
        template: child.template ? JSON.parse(`[${child.template}]`)[0] : null,
      })),
    }));
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
