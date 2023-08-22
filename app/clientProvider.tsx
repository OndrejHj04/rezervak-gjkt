"use client";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import useStore from "@/store/store";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <ThemeProvider theme={darkTheme}>
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}
