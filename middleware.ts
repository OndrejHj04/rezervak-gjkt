import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { getRoutes, rolesConfig } from "./rolesConfig";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const role = token?.role;
  const verified = token?.verified;
  const active = token?.active;

  if ((!verified || !active) && req.nextUrl.pathname !== "/" && role) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/login") && role) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    !getRoutes(Object.values(rolesConfig), role).some(
      (item: any) => item.path === req.nextUrl.pathname
    )
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (req.nextUrl.pathname.startsWith("/user/detail") && role) {
    const id = req.nextUrl.pathname.split("/")[3];
    const userId = token?.id.toString();
    const selfAccount = id === userId;

    if (
      selfAccount &&
      !rolesConfig.users.modules.userDetail.visitSelf.includes(role.id)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (
      !selfAccount &&
      !rolesConfig.users.modules.userDetail.visit.includes(role.id)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (
      req.nextUrl.search.includes("mode=edit") &&
      selfAccount &&
      !rolesConfig.users.modules.userDetail.selfEdit.includes(role.id)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (
      req.nextUrl.search.includes("mode=edit") &&
      !selfAccount &&
      !rolesConfig.users.modules.userDetail.edit.includes(role.id)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (req.nextUrl.pathname.startsWith("/group/detail") && role) {
    const group = req.nextUrl.pathname.split("/")[3];
    const userId = token?.id.toString();

    const request = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/group/check-user`,
      {
        method: "POST",
        body: JSON.stringify({
          groupId: Number(group),
          userId: Number(userId),
        }),
      }
    );

    const {
      data: { isMember, isOwner },
    } = await request.json();

    if (
      isMember &&
      !rolesConfig.groups.modules.groupsDetail.visitSelf.includes(role.id)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (
      !isMember &&
      !rolesConfig.groups.modules.groupsDetail.visit.includes(role.id)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (
      req.nextUrl.search.includes("mode=edit") &&
      !isOwner &&
      !rolesConfig.groups.modules.groupsDetail.edit.includes(role.id)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (role && req.nextUrl.pathname.startsWith("/reservations/detail")) {
    const reservation = req.nextUrl.pathname.split("/")[3];
    const userId = token?.id.toString();

    const request = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reservations/check-user`,
      {
        method: "POST",
        body: JSON.stringify({
          reservationId: Number(reservation),
          userId: Number(userId),
        }),
      }
    );

    const {
      data: { isMember, isLeader },
    } = await request.json();

    if (
      isMember &&
      !rolesConfig.reservations.modules.reservationsDetail.visitSelf.includes(
        role.id
      )
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (
      !isMember &&
      !rolesConfig.reservations.modules.reservationsDetail.visit.includes(
        role.id
      )
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (
      req.nextUrl.search.includes("mode=edit") &&
      !isLeader &&
      !rolesConfig.reservations.modules.reservationsDetail.edit.includes(
        role.id
      )
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
}

export const config = {
  matcher: "/((?!api|_next).*)",
};
