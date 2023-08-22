"use client";
import * as React from "react";
import "dayjs/locale/cs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar, csCZ } from "@mui/x-date-pickers";

export default function Calendar() {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="cs"
      localeText={
        csCZ.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <DateCalendar />
    </LocalizationProvider>
  );
}
