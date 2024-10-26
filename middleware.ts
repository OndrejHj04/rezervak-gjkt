import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { getRoutes, rolesConfig } from "./lib/rolesConfig";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req });

}

export const config = {
  matcher: "/((?!api|_next|favicon).*)",
};
