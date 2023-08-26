"use client";
import { ThemeProvider } from "@mui/material/styles";
import {
  CircularProgress,
  Paper,
  Typography,
  createTheme,
} from "@mui/material";
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
  const { user } = store();
  const mode = user.theme === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={mode}>
      <SessionProvider>
        <div className={`${user.status === "loading" && "opacity-0"}`}>
          {children}
        </div>
        {user.status === "loading" && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5">
            <CircularProgress size={60} />
          </div>
        )}
      </SessionProvider>
    </ThemeProvider>
  );
}
