"use client";
import { Reservation } from "@/types";
import { Badge, Box, Paper, Tooltip } from "@mui/material";
import {
  DateCalendar,
  LocalizationProvider,
  PickersDay,
  csCZ,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CzechLocale from "dayjs/locale/cs";
import SingleReservation from "../reservations/SingleReservation";

const renderDay = (props: any) => {
  const { day, outsideCurrentMonth, reservations, ...other } = props;

  const isReservation = reservations?.filter((r: any) =>
    dayjs(day).isBetween(r.from_date, r.to_date, "day", "[]")
  );

  return (
    <Tooltip
      title={
        <Box color="primary">
          <SingleReservation reservations={isReservation[0]} />
        </Box>
      }
      disableHoverListener={!isReservation.length}
    >
      <Badge
        variant="dot"
        sx={{ "& .MuiBadge-badge": { transform: "translate(-5px, 5px)" } }}
        color="error"
        invisible={outsideCurrentMonth || !isReservation.length}
      >
        <PickersDay
          {...other}
          day={day}
          outsideCurrentMonth={outsideCurrentMonth}
        />
      </Badge>
    </Tooltip>
  );
};

export default function RenderCalendar({
  reservations,
}: {
  reservations: Reservation[];
}) {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={CzechLocale as any}
      localeText={
        csCZ.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <DateCalendar
        slots={{
          day: renderDay,
        }}
        slotProps={{
          day: { reservations: reservations } as any,
        }}
      />
    </LocalizationProvider>
  );
}
