import { getToken } from "next-auth/jwt";
import withAuth from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { navConfig } from "./lib/navigationConfig";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const role = token?.role;

  if (req.nextUrl.pathname.startsWith("/login") && role) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/admin") && role?.role_id !== 1) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    req.nextUrl.pathname.startsWith("/user/list") &&
    role?.role_id !== 1 &&
    role?.role_id !== 2
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/user/detail")) {
    const id = req.nextUrl.pathname.split("/")[3];
    const userId = token?.id.toString();

    if (id !== userId && role?.role_id !== 1) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
}
