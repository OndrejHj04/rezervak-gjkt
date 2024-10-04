"use client"
import React from "react"
import { Button, ButtonBase, ButtonGroup, Divider, IconButton, Skeleton, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import UserMenuCard from "./UserCardMenu";
import { getTestUsers } from "@/lib/api";


export default function LoginButton({ children }: { children: React.ReactNode }) {
  const { status, data } = useSession();

  if (status === "loading") {
    return <Skeleton variant="rounded" width={180} height={50} />;
  }

  if (status === "unauthenticated") {
    return (
      <Link href="/login">
        <Button style={{ color: "white" }}>Přihlásit se</Button>
      </Link>
    );
  }

  if (data?.user) {
    return children
  }
  return null;
}


