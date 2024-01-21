"use client";
import { Button, Paper, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import fetcher from "@/lib/fetcher";

export default function ResetPasswordEmail({
  searchParams: { id, token },
}: {
  searchParams: { id: any; token: any };
}) {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    setError,
  } = useForm();

  const { push } = useRouter();

  const onSubmit = (data: any) => {
    fetcher(`/api/reset-password/email`, {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
      }),
    }).then((data) => {
      if (!data.email) {
        setError("email", {
          type: "custom",
          message: "Účet s tímto emailem nebyl nalezen",
        });
      } else {
        toast.success(`Email na obnovení hesla byl odeslán.`);
      }
    });
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
