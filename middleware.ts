import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { decode } from "jsonwebtoken";
import dayjs from "dayjs";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req })

  // disallow navigation when not loged in
  if (!token && req.nextUrl.pathname !== "/" && !req.nextUrl.pathname.startsWith("/password-reset")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // disallow to use password-reset when loged in
  if (token && req.nextUrl.pathname.startsWith("/password-reset")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/password-reset")) {
    const userId = req.nextUrl.searchParams.get("userId")
    const token = decode(req.nextUrl.searchParams.get("token") as any) as any

    // invalid token for reset password redirect
    if (!userId || !token || Number(userId) !== token.id || dayjs(token.exp).isBefore(new Date())) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (token) {
    // user that is not verified needs to stay only on homepage
    if (!token.user.verified && req.nextUrl.pathname !== "/") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
}

export const config = {
  matcher: "/((?!api|_next|favicon).*)",
};
