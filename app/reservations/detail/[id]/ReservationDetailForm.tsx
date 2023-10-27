"use client";
import { Reservation } from "@/types";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardHeader,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
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
  console.log(reservation);
  return (
    <>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2 ml-auto flex gap-2">
          <Button variant="outlined" type="submit" color="error">
            Odstranit
          </Button>
          <Button variant="outlined" type="submit" disabled={!isDirty}>
            Uložit
          </Button>
        </div>
        <Paper className="p-4 flex">
          <Typography variant="h5">Vedoucí rezervace</Typography>
          <AvatarWrapper data={reservation.leader as any} />
          <Typography variant="body1" className="font-semibold">
            {reservation.leader.first_name} {reservation.leader.last_name}
          </Typography>
          <Typography>{reservation.leader.email}</Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="flex flex-col gap-3 mx-3">
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
          <div className="flex flex-col gap-3">
            <TextField
              {...register("purpouse")}
              label="Účel rezervace"
              defaultValue={reservation.purpouse}
            />
            <Select defaultValue={reservation.rooms} {...register("rooms")}>
              {[...Array(5)].map((_, i) => (
                <MenuItem key={i} value={i + 1}>
                  {i + 1} Pokojů
                </MenuItem>
              ))}
              <MenuItem value={6}>Celá chata</MenuItem>
            </Select>
          </div>
        </Paper>
      </form>
    </>
  );
}
