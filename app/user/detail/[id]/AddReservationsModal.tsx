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
import { getReservationList, userAddReservations } from "@/lib/api";

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
  userEmail,
  setModal,
}: {
  currentReservations: number[];
  userId: number;
  userEmail: any;
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
    getReservationList({ limit: true, notStatus: [1, 4, 5] }).then((res) =>
      setReservations(res.data)
    );
  }, []);

  const onSubmit = (data: any) => {
    userAddReservations({
      user: userId,
      reservations: data.reservations.map((res: any) => res.id),
    }).then(({ success }) => {
      success && toast.success("Rezervace úspěšně přidány");
      !success && toast.error("Něco se nepovedlo");
    });
    MakeUserDetailRefetch(userId);
    setModal(false);
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
