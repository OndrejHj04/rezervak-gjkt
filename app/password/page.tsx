"use client";
import { Button, Paper, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import ResetPasswordTemplate from "@/templates/resetPassword/template";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm();
  const { push } = useRouter();
  const onSubmit = (data: any) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/password-reset`, {
      method: "POST",
      body: JSON.stringify({ email: data.email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Email úspěšně odeslán");
          push("/login");
        } else toast.error("Tento email není registrován");
      });
  };

  return (
    <Paper className="p-2 flex flex-col gap-2">
      <Typography variant="h5">Obnovit heslo</Typography>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          type="text"
          label="Email"
          variant="outlined"
          {...register("email", {
            required: true,
            pattern: {
              value: /@/,
              message: "Neplatný email",
            },
          })}
        />
        <Button type="submit" variant="contained" disabled={!isValid}>
          Obnovení hesla
        </Button>
      </form>
    </Paper>
  );
}
