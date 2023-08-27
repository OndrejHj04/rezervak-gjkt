"use client";

import { store } from "@/store/store";
import {
  Button,
  ThemeProvider,
  Tooltip,
  Typography,
  createTheme,
} from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function SigninButton() {
  const { data: session, status } = useSession();
  const { user } = store();
  useEffect(() => {
    if (status === "authenticated") {
      fetch(`http://localhost:3000/api/gettheme?email=${session.user?.email}`)
        .then((res) => res.json())
        .then((data) => {
          store.setState({ user: { ...session.user, status, ...data } });
        });
    }

    if (status === "unauthenticated") {
      store.setState({ user: { theme: "light", status } });
    }
  }, [session, status]);

  if (status === "loading") return <Typography>Loading...</Typography>;

  if (status === "authenticated" && session?.user) {
    return (
      <div className="rounded-full flex gap-2 py-0 px-2 items-center">
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
      </div>
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
