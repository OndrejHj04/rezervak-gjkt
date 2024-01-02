import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { rolesConfig } from "./rolesConfig";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const role = token?.role;
  const verified = token?.verified;
  const active = token?.active;

  const config = Object.values(rolesConfig).find(
    (item) => item.path === req.nextUrl.pathname
  );

  if (
    (!verified || !active) &&
    !req.nextUrl.pathname.startsWith("/api") &&
    !req.nextUrl.pathname.startsWith("/_") &&
    req.nextUrl.pathname !== "/"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/login") && role) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (role && config) {
    if (config.roles.length && !config.roles.includes(role.id as never)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  if (req.nextUrl.pathname.startsWith("/user/detail") && role) {
    const id = req.nextUrl.pathname.split("/")[3];
    const userId = token?.id.toString();
    const selfAccount = id === userId;

    if (
      selfAccount &&
      !rolesConfig.users.modules.detail.visitSelf.includes(role.id)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (
      !selfAccount &&
      !rolesConfig.users.modules.detail.visit.includes(role.id)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (
      req.nextUrl.search.includes("mode=edit") &&
      selfAccount &&
      !rolesConfig.users.modules.detail.selfEdit.includes(role.id)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (
      req.nextUrl.search.includes("mode=edit") &&
      !selfAccount &&
      !rolesConfig.users.modules.detail.edit.includes(role.id)
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
      !rolesConfig.groups.modules.detail.visitSelf.includes(role.id)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (
      !isMember &&
      !rolesConfig.groups.modules.detail.visit.includes(role.id)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (
      req.nextUrl.search.includes("mode=edit") &&
      !isOwner &&
      !rolesConfig.groups.modules.detail.edit.includes(role.id)
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
      !rolesConfig.reservations.modules.detail.visitSelf.includes(role.id)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (
      !isMember &&
      !rolesConfig.reservations.modules.detail.visit.includes(role.id)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (
      req.nextUrl.search.includes("mode=edit") &&
      !isLeader &&
      !rolesConfig.reservations.modules.detail.edit.includes(role.id)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
}
