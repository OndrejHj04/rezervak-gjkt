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
    /*
    const id = req.nextUrl.pathname.split("/")[3];
    const userId = token?.id.toString();

    if (id !== userId && role?.id !== 1) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    */
  }

  if (req.nextUrl.pathname.startsWith("/group/detail")) {
    if (!verified || !active) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (role?.id === 4) {
      const group = req.nextUrl.pathname.split("/")[3];
      const userId = token?.id.toString();

      const request = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/group/is-member?id=${userId}&group=${group}`
      );
      const { isMember } = await request.json();

      if (!isMember) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }

  if (config) {
    if (
      config.roles.length &&
      (!config.roles.includes(role?.id!) || !verified || !active)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
}
