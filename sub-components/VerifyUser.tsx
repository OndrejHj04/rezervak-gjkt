import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import { useForm } from "react-hook-form";
import { store } from "@/store/store";
import { signIn, useSession } from "next-auth/react";
import { Session } from "next-auth";

interface passwordForm {
  password: string;
  newPassword: string;
}

export default function VerifyUser({ id }: { id?: string }) {
  const { handleSubmit, register } = useForm<passwordForm>();
  const { setUser, setUserLoading } = store();

  const onSubmit = (data: passwordForm) => {
    setUserLoading(false);
    fetch(`http://localhost:3000/api/account/verify/${id}`, {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        signIn("credentials", {
          password: data.newPassword,
          email: res.data.email,
        });
      });
  };

  return (
    <Paper className="p-2">
      <div className="flex justify-between">
        <RunningWithErrorsIcon sx={{ color: "#ED9191" }} />
        <Typography variant="h5">Ověření účtu</Typography>
        <RunningWithErrorsIcon sx={{ color: "#ED9191" }} />
      </div>
      <Typography variant="body2">
        Je potřeba doplnit několik informací!
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <TextField label="Současné heslo" {...register("password")} />
        <TextField label="Nové heslo" {...register("newPassword")} />
        <Button variant="contained" type="submit">
          Odeslat
        </Button>
      </form>
    </Paper>
  );
}
