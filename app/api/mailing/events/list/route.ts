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
          'secondary_txt', events_children.secondary_txt, 'variables', events_children.variables, 'template', 
          IF(templates.id IS NULL, NULL, JSON_OBJECT('id', templates.id, 'name', templates.name, 'title', templates.title, 'text', templates.text)),
          'active', events_children.active)
        ) as children
        FROM events INNER JOIN events_children ON events_children.event = events.id
        LEFT JOIN templates ON templates.id = events_children.template
        GROUP BY events.id
    `,
      values: [],
    })) as any;

    console.log(events);
    const data = events.map((item: any) => {
      let children = Array.isArray(item.children)
        ? item.children
        : JSON.parse(`[${item.children}]`);
      return {
        ...item,
        children: children.map((child: any) => {
          let template =
            typeof child.template === "object"
              ? child.template
              : JSON.parse(`[${child.template}]`)[0];
          return {
            ...child,
            variables: child.variables.split(","),
            template: template,
          };
        }),
      };
    });
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
