"use client"
import React from "react"
import { Button, Skeleton } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function LoginButton({ children }: { children: React.ReactNode }) {
  const { status, data } = useSession();

  if (status === "loading") {
    return <Skeleton variant="rounded" width={180} height={50} />;
  }

  if (status === "unauthenticated") {
    return (
      <Button component={Link} href="/login" style={{ color: "white" }}>Přihlásit se</Button>
    );
  }

  if (data?.user) {
    return children
  }
  return null;
}


