"use client"

import { resetUserPassword } from "@/lib/api"
import { withToast } from "@/utils/toast/withToast"
import { Button, Divider, Paper, TextField, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

export default function ResetPasswordForm({ searchParams }: any) {
  const { register, handleSubmit, formState: { isValid, isDirty }, watch, reset } = useForm({
    defaultValues: { password1: "", password2: "" }
  });
  const { replace } = useRouter()
  const [password1, password2] = watch(["password1", "password2"]);

  const onSubmit = (data: any) => {
    if (data.password1 === data.password2) {
      withToast(resetUserPassword({ id: searchParams.userId, password: data.password1 }),
        {
          message: "auth.password.reset",
          onSuccess: () => replace("/")
        })

    } else {
      toast.error("Hesla se neshodují");
    }
    reset();
  };

  return (
    <Paper className="p-2 flex flex-col w-full max-w-[300px]">
      <Typography variant="h5" className="text-center">Změna hesla</Typography>
      <Divider flexItem />
      <Typography className="text-center">heslo musí mít minimálně 6 znaků</Typography>
      <form className="gap-2 flex flex-col mt-1" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          type="password"
          label="Nové heslo"
          fullWidth
          value={password1 || ""}
          {...register("password1", { required: true, minLength: 6 })}
        />
        <TextField
          type="password"
          label="Nové heslo znovu"
          fullWidth
          {...register("password2", { required: true, minLength: 6 })}
          value={password2 || ""}
        />
        <Button variant="contained" fullWidth type="submit" disabled={!isValid || !isDirty}>Změnit</Button>
      </form>
    </Paper>
  );
}
