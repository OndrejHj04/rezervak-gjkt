"use client"

import { createOutsideUser } from "@/lib/api"
import { Button, Paper, TextField, Typography } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-toastify"

export default function ReservationRegistrationCustom({ id }: { id: any }) {
  const { register, control, handleSubmit, formState: { isValid } } = useForm()
  const { refresh } = useRouter()

  const onSubmit = (data: any) => {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== "")
    );
    createOutsideUser({ ...filteredData, reservationId: id }).then(({ success, message }) => {
      if (success) toast.success("Uživatel úspěšně vytvořen a přidán do rezervace.")
      else toast.error(message || "Něco se nepovedlo")
      refresh()
    })

  }

  return (
    <div>
      <Typography variant="h5">Vlastní registrace</Typography>
      <Typography variant="body2">Vyplněním tohoto formuláře přidáte do rezervace nového účastníka, který ovšem nebude ověřený a budou pravděpodobně chybět některé jeho údaje.</Typography>
      <Typography variant="body2">Této možnosti využívejte pouze ve chvíli, kdy osoba nemá na aplikaci účet a opakovaně se odmítá registrovat.</Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex flex-col w-fit gap-3">
        <div className="flex gap-2">
          <TextField fullWidth label="Křestní jméno" {...register("first_name", { required: true })} />
          <TextField fullWidth label="Příjmení" {...register("last_name", { required: true })} />
        </div>
        <div className="flex gap-2">
          <TextField fullWidth label="Email" {...register("email")} />
          <TextField fullWidth label="Adresa" {...register("adress")} />
        </div>
        <div className="flex gap-2">
          <Controller name="birth_date" control={control} render={({ field }) => (
            <DatePicker label="Datum narození" className="w-full" {...field} disableFuture format="DD. MM. YYYY" />
          )} />
          <TextField label="Číslo OP" fullWidth {...register("ID_code")} />
        </div>
        <Button className="col-span-2" size="small" type="submit" disabled={!isValid} variant="contained">Uložit</Button>
      </form>
    </div>
  )
}
