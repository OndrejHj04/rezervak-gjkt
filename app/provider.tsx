"use client";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material";
import { SessionProvider } from "next-auth/react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function Provider({
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
