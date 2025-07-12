"use client"

import { sendResetPasswordEmail } from "@/lib/api"
import { withToast } from "@/utils/toast/withToast"
import { Button, Divider, Paper, TextField, Typography } from "@mui/material"
import { useForm } from "react-hook-form"

export default function ResetPassword() {
  const { register, handleSubmit, formState: { isValid, isDirty }, reset } = useForm()

  const onSubmit = (data: any) => {
    withToast(sendResetPasswordEmail({ email: data.email }), {
      message: 'auth.password.sendEmail'
    })

    reset(data)
  }

  return (
    <Paper className="flex flex-col p-2">
      <Typography variant="h6" className="text-center">Zapomenuté heslo?</Typography>
      <Divider flexItem />
      <form className="flex flex-col flex-1 gap-2" onSubmit={handleSubmit(onSubmit)}>
        <Typography>Na email vám odešleme odkaz na změnu hesla</Typography>
        <TextField label="Zadejte email" {...register("email", { required: true })} type="email" />
        <Button variant="contained" className="!mt-auto" type="submit" disabled={!isValid || !isDirty}>Změnit heslo</Button>
      </form>
    </Paper>
  )
}
