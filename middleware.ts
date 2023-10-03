import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { navConfig } from "./lib/navigationConfig";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const role = token?.role;
  const config = navConfig.find((item) => item.path === req.nextUrl.pathname);
  const verified = token?.verified;
  const active = token?.active;

  if (req.nextUrl.pathname.startsWith("/login") && role) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/user/detail")) {
    if (!verified || !active) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const id = req.nextUrl.pathname.split("/")[3];
    const userId = token?.id.toString();

    if (id !== userId && role?.role_id !== 1) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (config) {
    if (
      config.roles.length &&
      (!config.roles.includes(role?.role_id!) || !verified || !active)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
}
