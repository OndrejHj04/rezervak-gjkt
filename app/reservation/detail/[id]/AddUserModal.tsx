import {
  Autocomplete,
  Box,
  Button,
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
  reservation,
  setModal,
}: {
  currentUsers: number[];
  reservation: any;
  setModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [users, setUsers] = useState(null);

  const {
    handleSubmit,
    control,
    register,
    formState: { isValid },
    watch,
  } = useForm();

  const userReduction = reservation.rooms.reduce(
    (a: any, b: any) => a + b.people,
    0
  );

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/list`)
      .then((res) => res.json())
      .then((res) => setUsers(res.data));
  }, []);

  const onSubmit = (data: any) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations/add-users`, {
      method: "POST",
      body: JSON.stringify({
        reservation: reservation.id,
        users: data.users.map((user: any) => user.id),
      }),
    })
      .then((req) => req.json())
      .then((res) => {
        if (res.success) toast.success("Uživatelé úspěšně přidány");
        else toast.error("Něco se nepovedlo");
      });
    MakeRefetch(reservation.id);
    setModal(false);
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
        <Button variant="contained" className="mt-2" type="submit">
          Uložit
        </Button>
      </form>
    </Paper>
  );
}
