import { getToken } from "next-auth/jwt";
import withAuth from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;
  const role = token?.role;

  if (req.nextUrl.pathname.startsWith("/login") && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/admin") && role.role_name !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }
}
