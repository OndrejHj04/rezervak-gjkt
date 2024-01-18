"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Button,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { Reservation } from "@/types";
import {
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

import { Controller, useForm } from "react-hook-form";
import { store } from "@/store/store";
import SingleReservation from "@/app/homepage/reservations/SingleReservation";

dayjs.extend(isBetween as any);
dayjs.extend(isSameOrAfter as any);
dayjs.extend(isSameOrBefore as any);

const renderDay = (props: any) => {
  const { day, outsideCurrentMonth, reservations, ...other } = props;

  const isReservation = reservations?.filter((r: any) =>
    dayjs(day).isBetween(r.from_date, r.to_date, "day", "[]")
  );

  const thisDayRooms = isReservation.reduce(
    (a: any, b: any) => a + b.rooms.length,
    0
  );
  const isFull = thisDayRooms >= 6;
  console.log(thisDayRooms);
  return (
    <Badge
      sx={{ "& .MuiBadge-badge": { transform: "translate(5px, -5px)" } }}
      color={isFull ? "error" : "success"}
      badgeContent={
        isReservation.length && !outsideCurrentMonth ? thisDayRooms : 0
      }
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
  reservations: any[];
}) {
  const { createReservation, setCreateReservation } = store();
  const [expanded, setExpanded] = useState(false);
  const isValid = createReservation.from_date && createReservation.to_date;
  const [afterReservation, setAfterReservation] = useState(Infinity);
  const [beforeReservation, setBeforeReservation] = useState(Infinity);
  const [finalDate, setFinalDate] = useState("");
  const { handleSubmit, control, watch, formState, reset } = useForm({
    defaultValues: { from_date: null, to_date: null },
  });

  const { from_date, to_date } = watch();
  const onSubmit = ({
    from_date,
    to_date,
  }: {
    from_date: string;
    to_date: string;
  }) => {
    setFinalDate(
      `${dayjs(from_date).format("DD.MM.YYYY")} - ${dayjs(to_date).format(
        "DD.MM.YYYY"
      )}`
    );
    setExpanded(false);
    setCreateReservation({ ...createReservation, from_date, to_date });
  };

  useEffect(() => {
    if (watch("from_date")) {
      const lowestDiff = reservations.reduce((lowest, r) => {
        if (dayjs(watch("from_date")).isBefore(r.from_date, "day")) {
          const diff = dayjs(r.from_date).diff(watch("from_date"), "day");
          return diff < lowest ? diff : lowest;
        }
        return lowest;
      }, Infinity);
      setAfterReservation(lowestDiff);
    }

    if (watch("to_date")) {
      const lowestDiff = reservations.reduce((lowest, r) => {
        if (dayjs(watch("to_date")).isAfter(r.to_date, "day")) {
          const diff = dayjs(watch("to_date")).diff(r.to_date, "day");
          return diff < lowest ? diff : lowest;
        }
        return lowest;
      }, Infinity);
      setBeforeReservation(lowestDiff);
    }
  }, [watch(), reservations]);

  const toDateDisabled = (date: any) => {
    return (
      dayjs().isAfter(date) ||
      dayjs(date).isSameOrBefore(watch("from_date"), "day")
    );
  };

  const afterDateDisabled = (date: any) => {
    return (
      dayjs().isAfter(date) ||
      dayjs(date).isSameOrAfter(watch("to_date"), "day")
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)}>
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
            {finalDate && <Typography>{finalDate}</Typography>}
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
            <div className="flex gap-2 items-start">
              <Controller
                control={control}
                rules={{ required: true }}
                name="from_date"
                render={({ field: { onChange, value } }) => (
                  <StaticDatePicker
                    value={value}
                    orientation="portrait"
                    slots={{
                      day: renderDay,
                    }}
                    onChange={(date) => onChange(date)}
                    shouldDisableDate={(date) => afterDateDisabled(date)}
                    disableHighlightToday
                    slotProps={{
                      actionBar: { actions: [] },
                      day: { reservations: reservations } as any,
                    }}
                  />
                )}
              />

              <Controller
                name="to_date"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <StaticDatePicker
                    value={value}
                    orientation="portrait"
                    slots={{
                      day: renderDay,
                    }}
                    shouldDisableDate={(date) => toDateDisabled(date)}
                    onChange={(date) => onChange(date)}
                    disableHighlightToday
                    slotProps={{
                      actionBar: { actions: [] },
                      day: { reservations } as any,
                    }}
                  />
                )}
              />
              <div>
                <Typography>
                  Ve zvoleném termínu se nacházejí také tyto rezervace:
                </Typography>
                {from_date &&
                  to_date &&
                  reservations
                    .filter(
                      (res: any) =>
                        dayjs(res.from_date).isBetween(
                          from_date,
                          to_date,
                          "day",
                          "[]"
                        ) ||
                        dayjs(res.to_date).isBetween(
                          from_date,
                          to_date,
                          "day",
                          "[]"
                        )
                    )
                    .map((res: any) => (
                      <SingleReservation
                        display="long"
                        link={false}
                        key={res.id}
                        reservations={res}
                      />
                    ))}
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="contained"
                  type="submit"
                  disabled={!formState.isValid}
                >
                  Uložit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  disabled={!formState.isDirty}
                  onClick={() => {
                    reset();
                    setFinalDate("");
                    setCreateReservation({
                      ...createReservation,
                      from_date: "",
                      to_date: "",
                    });
                  }}
                >
                  zrušit
                </Button>
              </div>
            </div>
          </LocalizationProvider>
        </AccordionDetails>
      </Accordion>
    </form>
  );
}
