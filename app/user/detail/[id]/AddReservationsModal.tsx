"use client";

import {
  Autocomplete,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import MakeUserDetailRefetch from "./refetch";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  outline: "none",
  transform: "translate(-50%, -50%)",
};
export default function AddReservationsModal({
  currentReservations,
  userId,
  setModal,
}: {
  currentReservations: number[];
  userId: number;
  setModal: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm();

  const [reservations, setReservations] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations/list`)
      .then((res) => res.json())
      .then((res) => setReservations(res.data));
  }, []);

  const onSubmit = (data: any) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/add-reservations`, {
      method: "POST",
      body: JSON.stringify({
        user: userId,
        newReservations: data.reservations.map(
          (reservation: any) => reservation.id
        ),
        currentReservations,
      }),
    })
      .then((req) => req.json())
      .then((data) => toast.success("Rezervace úspěšně přidány"))
      .catch((err) => toast.error("Něco se nepovedlo"))
      .finally(() => {
        MakeUserDetailRefetch(userId);
        setModal(false);
      });
  };

  return (
    <Paper sx={style} className="p-2">
      <Typography variant="h5" className="mb-2 text-center">
        Přidat rezervace
      </Typography>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        {reservations ? (
          <Controller
            control={control}
            {...register("reservations", { required: true })}
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                value={value}
                onChange={(e, value) => {
                  onChange(value);
                }}
                sx={{ width: 300 }}
                multiple
                filterSelectedOptions
                getOptionDisabled={(option: any) =>
                  currentReservations.includes(option.id)
                }
                options={reservations}
                getOptionLabel={(option: any) => option.name}
                renderInput={(params) => (
                  <TextField {...params} label="Vybrat skupiny..." />
                )}
              />
            )}
          />
        ) : (
          <CircularProgress />
        )}
        <Button variant="contained" type="submit" disabled={!isValid}>
          Uložit
        </Button>
      </form>
    </Paper>
  );
}