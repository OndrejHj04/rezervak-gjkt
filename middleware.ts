import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { decode } from "jsonwebtoken";
import dayjs from "dayjs";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  if (!token && req.nextUrl.pathname !== "/" && !req.nextUrl.pathname.startsWith("/password-reset")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token && req.nextUrl.pathname.startsWith("/password-reset")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/password-reset")) {
    const userId = req.nextUrl.searchParams.get("userId")
    const token = decode(req.nextUrl.searchParams.get("token") as any) as any

    if (!userId || !token || Number(userId) !== token.id || dayjs(token.exp).isBefore(new Date())) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
}

export const config = {
  matcher: "/((?!api|_next|favicon).*)",
};
