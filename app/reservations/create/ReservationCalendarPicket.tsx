"use client";
import { Paper, Typography } from "@mui/material";
import { DateCalendar, LocalizationProvider, csCZ } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";
import CzechLocale from "dayjs/locale/cs";

export default function ReservationCalendarPicker() {
  return (
    <Paper className="p-2">
      <Typography variant="h5">Výběr data</Typography>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale={CzechLocale as any}
        localeText={
          csCZ.components.MuiLocalizationProvider.defaultProps.localeText
        }
      >
        <DateCalendar
          sx={{
            ".MuiDateCalendar-root": {
              width: 280,
            },
            ".MuiPickersCalendarHeader-root": {
              margin: 0,
              padding: 0,
            },
          }}
        />
      </LocalizationProvider>
    </Paper>
  );
}
