"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
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
import * as isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import * as isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import HotelIcon from "@mui/icons-material/Hotel";
import CancelIcon from "@mui/icons-material/Cancel";
import { useForm } from "react-hook-form";
dayjs.extend(isBetween as any);
dayjs.extend(isSameOrAfter as any);
dayjs.extend(isSameOrBefore as any);

const renderDay = (props: any) => {
  const { day, outsideCurrentMonth, reservations, ...other } = props;

  const isReservation = reservations.some((r: any) =>
    dayjs(day).isBetween(r.from_date, r.to_date, "day", "[]")
  );

  return (
    <Badge
      variant="dot"
      sx={{ "& .MuiBadge-badge": { transform: "translate(-5px, 5px)" } }}
      color="error"
      invisible={outsideCurrentMonth || !isReservation}
    >
      <PickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
      />
    </Badge>
  );
};

export default function ReservationDatesRender({
  reservations,
}: {
  reservations: Reservations[];
}) {
  const [expanded, setExpanded] = useState(true);
  const isValid = true;
  const [selectedDates, setSelectedDates] = useState<any[]>([null, null]);
  const [afterReservation, setAfterReservation] = useState(Infinity);

  const { handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    if (selectedDates[0]) {
      const lowestDiff = reservations.reduce((lowest, r) => {
        if (dayjs(selectedDates[0]).isBefore(r.from_date, "day")) {
          const diff = dayjs(r.from_date).diff(selectedDates[0], "day");
          return diff < lowest ? diff : lowest;
        }
        return lowest;
      }, Infinity);
      setAfterReservation(lowestDiff);
    }
  }, [selectedDates]);

  const toDateDisabled = (date: any) => {
    return (
      reservations.some((r) =>
        dayjs(date).isBetween(r.from_date, r.to_date, "day", "[]")
      ) ||
      dayjs(date).isSameOrBefore(selectedDates[0], "day") ||
      ((dayjs(date).isAfter(dayjs(selectedDates[0])) &&
        dayjs(date).diff(dayjs(selectedDates[0]), "day")) as number) >
        afterReservation
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
              <StaticDatePicker
                sx={{ width: 200 }}
                value={selectedDates[0]}
                slots={{
                  day: renderDay,
                }}
                shouldDisableDate={(date) =>
                  reservations.some((r) =>
                    dayjs(date).isBetween(r.from_date, r.to_date, "day", "[]")
                  ) || dayjs(date).isSameOrAfter(selectedDates[1], "day")
                }
                onChange={(date) => setSelectedDates([date, selectedDates[1]])}
                disableHighlightToday
                slotProps={{
                  actionBar: { actions: ["cancel"] },
                  day: { reservations: reservations } as any,
                }}
              />
              <StaticDatePicker
                sx={{ width: 200 }}
                value={selectedDates[1]}
                slots={{
                  day: renderDay,
                }}
                shouldDisableDate={(date) => toDateDisabled(date)}
                onChange={(date) => setSelectedDates([selectedDates[0], date])}
                disableHighlightToday
                slotProps={{
                  actionBar: { actions: ["cancel"] },
                  day: { reservations } as any,
                }}
              />
            </div>
          </LocalizationProvider>
        </AccordionDetails>
      </Accordion>
    </form>
  );
}
