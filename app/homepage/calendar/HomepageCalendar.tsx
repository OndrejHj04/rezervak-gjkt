"use client";
import { Paper } from "@mui/material";
import { DateCalendar, LocalizationProvider, csCZ } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CzechLocale from "dayjs/locale/cs";

export default function HomepageCalendar() {
  return (
    <Paper className="p-2">
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale={CzechLocale as any}
        localeText={
          csCZ.components.MuiLocalizationProvider.defaultProps.localeText
        }
      >
        <DateCalendar />
      </LocalizationProvider>
    </Paper>
  );
}
