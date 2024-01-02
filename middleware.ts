import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { navConfig } from "./lib/navigationConfig";
import { rolesConfig } from "./rolesConfig";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const role = token?.role;
  const config = navConfig.find((item) => item.path === req.nextUrl.pathname);
  const verified = token?.verified;
  const active = token?.active;

  if (req.nextUrl.pathname.startsWith("/login") && role) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/user/detail") && role) {
    const id = req.nextUrl.pathname.split("/")[3];
    const userId = token?.id.toString();
    const selfAccount = id === userId;

    if (selfAccount && !rolesConfig.users.detail.visitSelf.includes(role.id)) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (!selfAccount && !rolesConfig.users.detail.visit.includes(role.id)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (
      req.nextUrl.search.includes("mode=edit") &&
      selfAccount &&
      !rolesConfig.users.detail.selfEdit.includes(role.id)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (
      req.nextUrl.search.includes("mode=edit") &&
      !selfAccount &&
      !rolesConfig.users.detail.edit.includes(role.id)
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

    if (isMember && !rolesConfig.groups.detail.visitSelf.includes(role.id)) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (!isMember && !rolesConfig.groups.detail.visit.includes(role.id)) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (
      req.nextUrl.search.includes("mode=edit") &&
      !isOwner &&
      !rolesConfig.groups.detail.edit.includes(role.id)
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
      !rolesConfig.reservations.detail.visitSelf.includes(role.id)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (!isMember && !rolesConfig.reservations.detail.visit.includes(role.id)) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (
      req.nextUrl.search.includes("mode=edit") &&
      !isLeader &&
      !rolesConfig.reservations.detail.edit.includes(role.id)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
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
