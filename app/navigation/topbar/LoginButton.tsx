import React from "react"
import { Button, Skeleton } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function LoginButton({ children }: { children: React.ReactNode }) {

  if (status === "loading") {
    return <Skeleton variant="rounded" width={180} height={50} />;
  }

  if (status === "unauthenticated") {
    return (
    );
  }

  if (data?.user) {
    return children
  }
  return null;
}


