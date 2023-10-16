"use client";
import {
  Checkbox,
  FormControlLabel,
  Paper,
  Slider,
  Typography,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

export default function ReservationRoomsSlider() {
  const { register, control, watch, setValue } = useFormContext();
  const isChecked = watch("rooms") >= 5;
  const handleCheck = () => {
    if (isChecked) {
      return setValue("rooms", 1);
    }
    return setValue("rooms", 5);
  };

  return (
    <Paper className="p-2 h-min">
      <Typography variant="h5">Počet pokojů: {watch("rooms")}</Typography>
      <Controller
        control={control}
        {...register("rooms")}
        render={({ field }) => <Slider {...field} min={1} max={5} />}
      />
      <FormControlLabel
        control={<Checkbox checked={isChecked} onClick={handleCheck} />}
        label="Celá chata (5 pokojů)"
      />
    </Paper>
  );
}
