"use client";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import { store } from "@/store/store";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const { darkMode } = store();
  const mode = darkMode ? darkTheme : lightTheme;
  return (
    <ThemeProvider theme={mode}>
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}
