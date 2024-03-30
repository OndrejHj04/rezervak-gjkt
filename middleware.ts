import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { getRoutes, rolesConfig } from "./lib/rolesConfig";
import { guestSection } from "./lib/endpoints";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const role = token?.role;
  const verified = token?.verified;
  const active = token?.active;
  const routes = getRoutes(Object.values(rolesConfig), role);

  if (req.nextUrl.pathname.includes("/api")) {
    if (
      token?.email === guestSection.email &&
      !guestSection.endpoints.some((item) =>
        req.nextUrl.pathname.includes(item)
      )
    ) {
      return NextResponse.json({ data: [] });
    }
    return;
  }

  if ((!verified || !active) && req.nextUrl.pathname !== "/" && role) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    (req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/password-reset")) &&
    role
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    !req.nextUrl.pathname.includes("detail") &&
    !routes.some((item: any) => item.path === req.nextUrl.pathname)
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
    console.log(request);
    const { data } = await request.json();
    const { isMember, isOwner, exist } = data;

    if (!exist) {
      return NextResponse.redirect(new URL("/", req.url));
    }
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

  if (role && req.nextUrl.pathname.startsWith("/reservation/detail")) {
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
    const { data } = await request.json();
    const { isMember, isLeader, exist, archived, forbidden } = data;

    if (!exist || forbidden) {
      return NextResponse.redirect(new URL("/", req.url));
    }
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
      ((!isLeader &&
        !rolesConfig.reservations.modules.reservationsDetail.edit.includes(
          role.id
        )) ||
        archived)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
}

export const config = {
  matcher: "/((?!_next|favicon).*)",
};
