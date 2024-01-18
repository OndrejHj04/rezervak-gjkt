"use client";
import { Reservation } from "@/types";
import { Badge, Box, Tooltip, Typography } from "@mui/material";
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
  const isBlocation = isReservation.filter((r: any) => r.status.id === 5);
  const thisDayRooms = isReservation.reduce(
    (a: any, b: any) => a + b.rooms.length,
    0
  );
  const isFull = thisDayRooms >= 6;

  return (
    <Tooltip
      title={
        <Box color="primary">
          {isReservation.map((res: any) => (
            <SingleReservation reservations={res} key={res.id} />
          ))}
        </Box>
      }
      disableHoverListener={!isReservation.length}
    >
      <Badge
        sx={{
          "& .MuiBadge-badge": {
            transform: "translate(5px, -5px)",
          },
        }}
        color={isFull ? "error" : "success"}
        badgeContent={
          isReservation.length && !outsideCurrentMonth ? thisDayRooms : 0
        }
      >
        <PickersDay
          {...other}
          day={day}
          disabled={isBlocation.length}
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
    <>
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
    </>
  );
}
