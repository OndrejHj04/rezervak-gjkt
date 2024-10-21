"use client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { csCZ as CzechComponents } from "@mui/material/locale";
import { csCZ as CzechDatePickers, csCZ } from "@mui/x-date-pickers/locales";
import { SessionProvider } from "next-auth/react";
import "material-icons/iconfont/material-icons.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CzechLocale from "dayjs/locale/cs";

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
  }, CzechComponents, CzechDatePickers);

  return (
    <ThemeProvider theme={mode}>
      <LocalizationProvider dateAdapter={AdapterDayjs}
        adapterLocale={CzechLocale as any}
        localeText={
          csCZ.components.MuiLocalizationProvider.defaultProps.localeText
        }
      >
        <CssBaseline />
        <SessionProvider>{children}</SessionProvider>
      </LocalizationProvider>
    </ThemeProvider >
  );
}
