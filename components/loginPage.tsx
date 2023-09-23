"use client";
import { Button, Paper, TextField, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    signIn("credentials", {
      name: data.name,
      password: data.password,
      redirect: false,
    }).then((res) => {
      if (res?.error) {
        //chyba
      } else {
        window.location.href = "/";
      }
    });
  };

  return (
    <Paper className="p-2 flex flex-col gap-2">
      <Typography variant="h5">Přihlašovací formulář</Typography>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          type="text"
          label="Uživatelské jméno"
          variant="outlined"
          {...register("name")}
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
      <Button variant="contained" onClick={() => signIn("google")}>
        GOOGLE
      </Button>
    </Paper>
  );
}
