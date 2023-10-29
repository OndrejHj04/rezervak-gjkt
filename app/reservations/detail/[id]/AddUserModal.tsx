import {
  Autocomplete,
  Box,
  Button,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import MakeRefetch from "./refetch";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  outline: "none",
  transform: "translate(-50%, -50%)",
};

export default function AddUserModal({
  currentUsers,
  reservationId,
  setModal,
}: {
  currentUsers: number[];
  reservationId: number;
  setModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [users, setUsers] = useState(null);

  const {
    handleSubmit,
    control,
    register,
    formState: { isValid },
  } = useForm();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/list`)
      .then((res) => res.json())
      .then((res) => setUsers(res.data));
  }, []);

  const onSubmit = (data: any) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations/add-users`, {
      method: "POST",
      body: JSON.stringify({
        reservation: reservationId,
        newUsers: data.users.map((user: any) => user.id),
        currentUsers,
      }),
    })
      .then((req) => req.json())
      .then((data) => toast.success("Uživatelé úspěšně přidány"))
      .catch((err) => toast.error("Něco se nepovedlo"))
      .finally(() => {
        MakeRefetch(reservationId);
        setModal(false);
      });
  };

  return (
    <Paper sx={style} className="p-2 ">
      <Typography variant="h5" className="mb-2 text-center">
        Přidat uživatele
      </Typography>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        {users ? (
          <Controller
            control={control}
            {...register("users", { required: true })}
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                sx={{ width: 300 }}
                value={value}
                onChange={(e, value) => {
                  onChange(value);
                }}
                multiple
                filterSelectedOptions
                getOptionDisabled={(option: any) =>
                  currentUsers.includes(option.id)
                }
                options={users}
                getOptionLabel={(option: any) =>
                  `${option.first_name} ${option.last_name}`
                }
                renderOption={(props: any, option: any) => (
                  <div {...props}>
                    <Box className="flex items-center gap-2">
                      <AvatarWrapper data={option} />
                      <Typography className="ml-2">
                        {option.first_name} {option.last_name}
                      </Typography>
                    </Box>
                  </div>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Vybrat uživatele..." />
                )}
              />
            )}
          />
        ) : (
          <CircularProgress />
        )}
        <Button
          variant="contained"
          className="mt-2"
          type="submit"
          disabled={!isValid}
        >
          Uložit
        </Button>
      </form>
    </Paper>
  );
}
