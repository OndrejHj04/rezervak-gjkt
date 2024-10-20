import {
  Autocomplete,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import UserCard from "@/app/user/detail/UserCard";
import { getUserList, reservationAddUsers } from "@/lib/api";
import { useRouter } from "next/navigation";

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
  const { refresh } = useRouter()
  const { handleSubmit, control, register } = useForm();

  useEffect(() => {
    getUserList().then(({ data }) => setUsers(data));
  }, []);

  const onSubmit = (data: any) => {
    reservationAddUsers({
      reservation: reservation.id,
      users: data.users.map((user: any) => user.id),
    }).then(({ success }) => {
      success && toast.success("Uživatelé úspěšně přidáni");
      !success && toast.error("Něco se nepovedlo");
    });
    refresh()
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
                  <UserCard {...props} user={option} />
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
