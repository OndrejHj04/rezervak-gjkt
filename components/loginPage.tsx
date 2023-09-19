"use client";
import { Button, Paper, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const { register } = useForm();

  return (
    <Paper className="p-2 flex flex-col gap-2">
      <Typography variant="h5">Přihlašovací formulář</Typography>
      <form className="flex flex-col gap-2">
        <TextField
          type="text"
          label="Uživatelské jméno"
          variant="outlined"
          {...register("username")}
        />
        <TextField
          type="password"
          variant="outlined"
          label="Heslo"
          {...register("password")}
        />
        <Button type="submit" variant="contained">
          Přihlásit se
        </Button>
      </form>
    </Paper>
  );
}
