"use client";

import { Button, Tooltip, Typography } from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function SigninButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return <Typography>Loading...</Typography>;

  if (status === "authenticated" && session?.user) {
    return (
      <Button
        variant="contained"
        className="rounded-full flex gap-2 py-0 px-2"
        sx={{ textTransform: "none" }}
        onClick={() => signOut()}
      >
        <Image
          width={45}
          height={45}
          src={session?.user.image as string}
          alt="profile"
          className="rounded-full"
        />
        <div className="sm:flex hidden flex-col items-start">
          <Typography variant="h6">{session?.user?.name}</Typography>
          <Typography variant="caption">{session?.user?.email}</Typography>
        </div>
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signIn("google")}
      className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
    >
      Přihlásit se
    </button>
  );
}
