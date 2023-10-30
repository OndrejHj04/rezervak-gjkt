import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  CircularProgress,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import MakeGroupDetailRefetch from "./refetch";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  outline: "none",
  transform: "translate(-50%, -50%)",
};

export default function AddGroupToReservationModal({
  groupId,
  setModal,
  currentReservations,
}: {
  groupId: number;
  setModal: Dispatch<SetStateAction<boolean>>;
  currentReservations: number[];
}) {
  const [reservations, setReservations] = useState(null);
  const {
    handleSubmit,
    control,
    register,
    formState: { isValid },
  } = useForm();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations/list`)
      .then((res) => res.json())
      .then((res) => setReservations(res.data));
  }, []);

  const onSubmit = (data: any) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/add-reservations`, {
      method: "POST",
      body: JSON.stringify({
        group: groupId,
        newReservations: data.reservations.map((group: any) => group.id),
        currentReservations: currentReservations,
      }),
    })
      .then((req) => req.json())
      .then((data) => toast.success("Skupiny úspěšně přidány"))
      .catch((err) => toast.error("Něco se nepovedlo"))
      .finally(() => {
        MakeGroupDetailRefetch(groupId);
        setModal(false);
      });
  };

  return (
    <Paper sx={style} className="p-2 ">
      <Typography variant="h5" className="mb-2 text-center">
        Přidat skupinu do rezervace
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
                renderOption={(props: any, option: any) => (
                  <div {...props}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography>{option.name}</Typography>
                      <Typography variant="caption">
                        {dayjs(option.from_date).format("DD.MM.YYYY")}{" "}
                        {dayjs(option.to_date).format("DD.MM.YYYY")}
                      </Typography>
                    </Box>
                  </div>
                )}
                getOptionLabel={(option: any) => `${option.name} ${dayjs(
                  option.from_date
                ).format("DD.MM.YYYY")}
                ${dayjs(option.to_date).format("DD.MM.YYYY")}`}
                getOptionDisabled={(option: any) =>
                  currentReservations.includes(option.id)
                }
                options={reservations}
                renderInput={(params) => (
                  <TextField {...params} label="Vybrat uživatele..." />
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
