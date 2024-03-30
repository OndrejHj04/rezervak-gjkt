"use client";
import { Button, Paper, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { sendResetPasswordEmail } from "@/lib/api";

export default function ResetPasswordEmail() {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    setError,
    reset,
  } = useForm();

  const onSubmit = (data: any) => {
    sendResetPasswordEmail({ email: data.email }).then(({ success }) => {
      if (!success) {
        setError("email", {
          type: "custom",
          message: "Účet s tímto emailem nebyl nalezen",
        });
      } else {
        toast.success(`Email na obnovení hesla byl odeslán.`);
      }
    });
    reset();
  };

  return (
    <Paper className="p-2 flex flex-col gap-2">
      <Typography variant="h5">Obnovit heslo</Typography>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          type="text"
          label="Email"
          error={errors.email as any}
          helperText={errors.email?.message as any}
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
