"use client";
import { AdminCredentialsType } from "@/models/User";
import { Button, Paper, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

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
    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/admin/edit-credentials", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        toast.info(res.message);
      })
      .catch((e) => toast.error("Something went wrong"));
  };

  return (
    <Paper className="p-2 flex flex-col gap-2 h-min">
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
