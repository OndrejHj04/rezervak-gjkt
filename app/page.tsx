"use client";
import { Typography } from "@mui/material";
import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();
  console.log(session);
  return (
    <>
      <Typography>Homepage</Typography>
    </>
  );
}
