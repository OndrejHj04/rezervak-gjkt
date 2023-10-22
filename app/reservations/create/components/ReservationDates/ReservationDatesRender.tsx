"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Paper,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { Reservations } from "@/types";
import {
  DateCalendar,
  DatePicker,
  DatePickerToolbar,
  LocalizationProvider,
  PickersDay,
  StaticDatePicker,
  csCZ,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CzechLocale from "dayjs/locale/cs";
import dayjs from "dayjs";
import * as isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween as any);

function makeDay(props: any) {
  const { outsideCurrentMonth, reservations, day, ...other } = props;

  const isValid = reservations.some(
    ({ from_date, to_date }: { from_date: string; to_date: string }) =>
      dayjs(day).isBetween(from_date, to_date, null, "[]")
  );

  return (
    <PickersDay
      {...other}
      sx={{ backgroundColor: isValid && "error.main" }}
      outsideCurrentMonth={outsideCurrentMonth}
      day={day}
    />
  );
}

export default function ReservationDatesRender({
  reservations,
}: {
  reservations: Reservations[];
}) {
  const [expanded, setExpanded] = useState(true);
  const isValid = true;
  const [highlightedDays, setHighlightedDays] = useState([1, 2, 15]);

  return (
    <Accordion expanded={expanded}>
      <AccordionSummary
        onClick={() => setExpanded((c) => !c)}
        expandIcon={
          isValid && !expanded ? (
            <CheckCircleIcon color="success" />
          ) : (
            <ExpandMoreIcon />
          )
        }
      >
        <div className="flex gap-5 items-center">
          <Typography variant="h6">Termín rezervace</Typography>
          <Typography>17. 6. 2020 - 14. 8. 2021</Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={CzechLocale as any}
          localeText={
            csCZ.components.MuiLocalizationProvider.defaultProps.localeText
          }
        >
          <div className="flex gap-2">
            <DateCalendar
              sx={{ margin: 0 }}
              slots={{
                day: makeDay,
              }}
              slotProps={{
                day: {
                  reservations: reservations.map(({ from_date, to_date }) => ({
                    from_date,
                    to_date,
                  })),
                } as any,
              }}
            />
          </div>
        </LocalizationProvider>
      </AccordionDetails>
    </Accordion>
  );
}
