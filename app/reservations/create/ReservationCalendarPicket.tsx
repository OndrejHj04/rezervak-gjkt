"use client";
import { Paper, Typography } from "@mui/material";
import {
  DateCalendar,
  DatePicker,
  LocalizationProvider,
  csCZ,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";
import CzechLocale from "dayjs/locale/cs";
import { useFormContext } from "react-hook-form";

export default function ReservationCalendarPicker() {
  const { watch, setValue } = useFormContext();
  return (
    <Paper className="p-2 h-min">
      <Typography variant="h5">Výběr data</Typography>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale={CzechLocale as any}
        localeText={
          csCZ.components.MuiLocalizationProvider.defaultProps.localeText
        }
      >
        <div className="flex flex-col gap-2 mt-2">
          <DatePicker
            label="Začátek rezervace"
            className="w-48"
            value={watch("fromDate")}
            onChange={(date) => setValue("fromDate", date)}
          />

          <DatePicker
            label="Konec rezervace"
            className="w-48"
            value={watch("toDate")}
            onChange={(date) => setValue("fromDate", date)}
          />
        </div>
      </LocalizationProvider>
    </Paper>
  );
}
