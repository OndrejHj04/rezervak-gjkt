"use client";
import { AdminCredentialsType } from "@/models/User";
import { Button, Paper, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

function AdminCredentials({
  data: { password, username },
}: {
  data: AdminCredentialsType;
}) {
  const {
    handleSubmit,
    register,
    formState: { isDirty },
  } = useForm<AdminCredentialsType>();

  const onSubmit = (data: AdminCredentialsType) => {
    console.log(data);
  };

  return (
    <Paper className="p-2 flex flex-col gap-2">
      <Typography variant="h5">Administrátorské přihlášení</Typography>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          variant="outlined"
          type="text"
          {...register("username")}
          label="Uživatelské jméno"
          defaultValue={username}
        />
        <TextField
          variant="outlined"
          type="password"
          {...register("password")}
          label="Heslo"
          defaultValue={password}
        />
        <Button variant="contained" type="submit" disabled={!isDirty}>
          Uložit
        </Button>
      </form>
    </Paper>
  );
}

export default AdminCredentials;
