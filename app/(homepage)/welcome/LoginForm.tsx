"use client"
import { Button, Divider, Paper, TextField, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function LoginForm() {
  const { register, handleSubmit, formState: { isValid } } = useForm()
  const params = useSearchParams()
  const signInError = params.get('error')

  useEffect(() => {
    if (signInError) toast.error("Přihlášení se nepodařilo")
  }, [signInError])

  const onSubmit = (data: any) => {
    signIn("credentials", {
      email: data.email,
      password: data.password
    })
  }

  return (
    <Paper className="p-2">
      <Typography variant="h6" className="text-center">Pro používání aplikace se přihlašte</Typography>
      <Divider flexItem className="!mb-2" />
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <TextField label="Email" {...register("email", { required: true })} />
        <TextField label="Heslo" {...register("password", { required: true })} type="password" />
        <Button type="submit" disabled={!isValid} variant="contained">Přihlášení</Button>
        <Button
          className="w-full"
          variant="contained"
          onClick={() => signIn("google")}
        >
          Použít google účet
        </Button>
      </form>
    </Paper>
  )
}
