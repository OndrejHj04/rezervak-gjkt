"use client";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { SessionProvider } from "next-auth/react";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return <SessionProvider>{children}</SessionProvider>;
}
