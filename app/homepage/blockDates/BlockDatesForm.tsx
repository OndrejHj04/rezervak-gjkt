"use client";

import {
  DatePicker,
  LocalizationProvider,
  PickersDay,
  csCZ,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { Controller, useForm } from "react-hook-form";
import CzechLocale from "dayjs/locale/cs";
import { Badge, Box, Button, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";
import SingleReservation from "../reservations/SingleReservation";
import { toast } from "react-toastify";
import { revalidatePath } from "next/cache";
import HomepageRefetch from "../refetch";
import fetcher from "@/lib/fetcher";

export default function BlockDatesForm({
  reservations,
  userId,
}: {
  reservations: any;
  userId: any;
}) {
  const {
    handleSubmit,
    reset,
    control,
    watch,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      from_date: null,
      to_date: null,
    },
  });
  const onSubmit = (data: any) => {
    fetcher(`/api/reservations/block`, {
      method: "POST",
      body: JSON.stringify({
        from_date: data.from_date,
        to_date: data.to_date,
        userId: userId,
      }),
    }).then(({ data }: any) => {
      toast.success(
        `Termín od ${dayjs(data.from_date).format("DD. MM. YYYY")} do ${dayjs(
          data.to_date
        ).format("DD. MM. YYYY")} je blokován.`
      );
      reset();
      HomepageRefetch();
    });
  };

  const renderDay = (props: any) => {
    const { outsideCurrentMonth, day, ...other } = props;
    const isReservation = reservations?.filter((r: any) =>
      dayjs(day).isBetween(r.from_date, r.to_date, "day", "[]")
    );
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-between h-full"
    >
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale={CzechLocale as any}
        localeText={
          csCZ.components.MuiLocalizationProvider.defaultProps.localeText
        }
      >
        <DemoContainer components={["DatePicker"]}>
          <div className="flex flex-col gap-4">
            <Controller
              control={control}
              name="from_date"
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <DatePicker
                  label="Začátek blokace"
                  format="DD. MM. YYYY"
                  value={value}
                  className="flex-1"
                  onChange={(date: any) => onChange(date)}
                  slots={{ day: renderDay }}
                />
              )}
            />

            <Controller
              control={control}
              name="to_date"
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <DatePicker
                  label="Konec blokace"
                  format="DD. MM. YYYY"
                  value={value}
                  className="flex-1"
                  onChange={(date: any) => onChange(date)}
                  slots={{ day: renderDay }}
                />
              )}
            />
          </div>
        </DemoContainer>
      </LocalizationProvider>
      <div className="mt-auto">
        <Button type="submit" variant="contained" disabled={!isValid}>
          Zablokovat termín a zrušit rezervace
        </Button>
      </div>
    </form>
  );
}
