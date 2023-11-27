"use client";
import { store } from "@/store/store";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

import { SessionProvider, signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import "material-icons/iconfont/material-icons.css";

export default function ClientProvider({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: any;
}): React.ReactNode {
  const mode = createTheme({
    palette: {
      mode: theme ? "light" : "dark",
    },
  });

  return (
    <ThemeProvider theme={mode}>
      <CssBaseline />
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}
