"use client";
import { Reservation } from "@/types";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import { Button, Card, CardHeader, Paper, Typography } from "@mui/material";
import ReservationCalendar from "./ReservationCalendar";
import { use, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function ReservationDetailForm({
  reservation,
}: {
  reservation: Reservation;
}) {
  const {
    register,
    watch,
    handleSubmit,
    control,
    formState: { isDirty },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <Button
        variant="outlined"
        className="mb-2 ml-auto"
        type="submit"
        disabled={!isDirty}
      >
        Uložit
      </Button>
      <Paper className="p-2 flex">
        <Card>
          <Typography variant="h5">Vedoucí rezervace</Typography>
          <CardHeader
            avatar={<AvatarWrapper data={reservation.leader as any} />}
            title={
              <Typography variant="body1" className="font-semibold">
                {reservation.leader.first_name} {reservation.leader.last_name}
              </Typography>
            }
            subheader={<Typography>{reservation.leader.email}</Typography>}
          />
        </Card>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="flex flex-col">
            <Controller
              control={control}
              name="from_date"
              defaultValue={dayjs(reservation.from_date)}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  value={value}
                  onChange={onChange}
                  label="Začátek rezervace"
                  format="DD.MM.YYYY"
                />
              )}
            />
            <Controller
              control={control}
              name="to_date"
              defaultValue={dayjs(reservation.to_date)}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  value={value}
                  onChange={onChange}
                  label="Konec rezervace"
                  format="DD.MM.YYYY"
                />
              )}
            />
          </div>
        </LocalizationProvider>
      </Paper>
    </form>
  );
}
