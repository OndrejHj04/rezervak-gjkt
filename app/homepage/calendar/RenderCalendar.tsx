"use client";
import { Reservation } from "@/types";
import { Paper } from "@mui/material";
import { DateCalendar, LocalizationProvider, csCZ } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CzechLocale from "dayjs/locale/cs";

export default function RenderCalendar({
  reservations,
}: {
  reservations: Reservation[];
}) {
  console.log(reservations);
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
