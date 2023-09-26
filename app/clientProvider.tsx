"use client";
import { store } from "@/store/store";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const { setRoles } = store();
  useEffect(() => {
    fetch("http://localhost:3000/api/roles/list")
      .then((res) => res.json())
      .then(({ data }) => setRoles(data));
  }, []);
  return <SessionProvider>{children}</SessionProvider>;
}
