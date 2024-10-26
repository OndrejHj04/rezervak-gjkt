"use client"

import { sendResetPasswordEmail } from "@/lib/api"
import { Button, Divider, Paper, TextField, Typography } from "@mui/material"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

export default function ResetPassword() {
  const { register, handleSubmit, formState: { isValid, isDirty }, reset } = useForm()

  const onSubmit = (data: any) => {
    sendResetPasswordEmail({ email: data.email }).then(({ success }) => {
      if (success) toast.success("Email na změnu hesla odeslán")
      else toast.error("Tento email není v aplikaci registrovaný")
      reset(data)
    })
  }

  return (
    <Paper className="w-full flex flex-col max-w-[300px] p-2">
      <Typography variant="h6" className="text-center">Zapomenuté heslo?</Typography>
      <Divider flexItem />
      <form className="flex flex-col flex-1 gap-2" onSubmit={handleSubmit(onSubmit)}>
        <Typography>Na email vám odešleme odkaz na změnu hesla</Typography>
        <TextField label="Zadejte email" {...register("email", { required: true })} type="email" />
        <Button variant="contained" className="mt-auto" type="submit" disabled={!isValid || !isDirty}>Změnit heslo</Button>
      </form>
    </Paper>
  )
}
