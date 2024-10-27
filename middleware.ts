import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { decode } from "jsonwebtoken";
import dayjs from "dayjs";
import { actionMenu, otherRoutes, sideMenu } from "./lib/rolesConfig";
import { access } from "fs";
import { OtherHouses } from "@mui/icons-material";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req }) as any

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

    if (req.nextUrl.pathname.startsWith("/user/detail")) {
      const userId = Number(req.nextUrl.pathname.split("/")[3])
      const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/exists`)
      const { exists } = await request.json()

      if (!exists) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      // roles 1 and 2 can get into edit mode on any user
      if (token.user.role.id !== 3) {
        return NextResponse.next()
      }

      // user role 3 can edit only their profile
      if (userId !== token.user.id && req.nextUrl.searchParams.get("mode") === "edit") {
        return NextResponse.redirect(new URL("/", req.url));
      }

      return NextResponse.next()
    }

    if (req.nextUrl.pathname.startsWith("/reservation/detail")) {
      const reservationId = Number(req.nextUrl.pathname.split("/")[3])
      const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations/${reservationId}/leader`)
      const { leader } = await request.json()

      // redirect when group not exist
      if (!leader) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      // roles 1 and 2 can get into edit mode on any reservation
      if (token.user.role.id !== 3) {
        return NextResponse.next()
      }

      // disalow to edit reservation for user without rights
      if (req.nextUrl.searchParams.get("mode") === "edit" && leader !== token.user.id) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      return NextResponse.next()
    }

    if (req.nextUrl.pathname.startsWith("/group/detail")) {
      const groupId = Number(req.nextUrl.pathname.split("/")[3])
      const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/${groupId}/leader`)
      const { owner } = await request.json()

      // redirect when group not exist
      if (!owner) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      // roles 1 and 2 can get into edit mode on any group
      if (token.user.role.id !== 3) {
        return NextResponse.next()
      }

      // disalow to edit group for user without rights
      if (req.nextUrl.searchParams.get("mode") === "edit" && owner !== token.user.id) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      return NextResponse.next()
    }

    if (req.nextUrl.pathname.startsWith("/mailing/templates/detail")) {
      const templateId = Number(req.nextUrl.pathname.split("/")[4])
      const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/template/${templateId}/exists`)
      const { exists } = await request.json()

      if (!exists) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      return NextResponse.next()
    }

    if (req.nextUrl.pathname.startsWith("/mailing/send/detail")) {
      const mailId = Number(req.nextUrl.pathname.split("/")[4])
      const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mails/${mailId}/exists`)
      const { exists } = await request.json()

      if (!exists) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next()
    }

    if ((req.nextUrl.pathname.startsWith("/mailing") || req.nextUrl.pathname.startsWith("/registration")) && token.user.role.id === 3) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const routes = [...sideMenu.flatMap((item) => item.href), ...actionMenu.flatMap((item) => item.href), ...otherRoutes]
    if (!routes.includes(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
}

export const config = {
  matcher: "/((?!api|_next|favicon).*)",
};
