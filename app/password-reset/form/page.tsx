"use client";
import { Button, Paper, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { decode } from "jsonwebtoken";
import { useEffect } from "react";
import dayjs from "dayjs";
export default function ResetPassword({
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

  useEffect(() => {
    try {
      const { exp, id: userId } = decode(token) as any;
      if (userId !== Number(id) || dayjs(exp).isAfter(dayjs())) {
        push("/");
      }
    } catch (e) {
      push("/");
    }
  }, []);

  const onSubmit = (data: any) => {
    const { first_password, second_password } = data;
    if (first_password === second_password) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reset-password`, {
        method: "POST",
        body: JSON.stringify({
          password: first_password,
          id,
        }),
      }).then(res=>res.json()).then(()=>{
        toast.success("Heslo úspěšně změněno")
      })
    } else {
      setError("second_password", {
        type: "custom",
        message: "Zadaná hesla se neshodují",
      });
    }
  };
  return (
    <Paper className="p-2 flex flex-col gap-2">
      <Typography variant="h5">Nové heslo</Typography>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          type="password"
          label="Nové heslo"
          variant="outlined"
          {...register("first_password", {
            required: true,
            pattern: {
              value: /^.{6,}$/,
              message: "Heslo musí mít alespoň 6 znaků",
            },
          })}
        />
        <TextField
          type="password"
          label="Heslo znovu"
          error={errors.second_password as any}
          helperText={errors.second_password?.message as any}
          variant="outlined"
          {...register("second_password", {
            required: true,
          })}
        />
        <Button type="submit" variant="contained" disabled={!isValid}>
          uložit
        </Button>
      </form>
    </Paper>
  );
}
