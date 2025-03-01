"use client"

import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import { Controller, useForm } from "react-hook-form"
import * as isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useEffect, useState } from "react"
import { createFamilyAccount } from "@/lib/api"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
dayjs.extend(isSameOrBefore as any);

export default function CreateFamilyAccountForm({ user }: { user: any }) {
  const { push, refresh } = useRouter()
  const [autoAdress, setAutoAdress] = useState("")
  const { handleSubmit, register, reset, control, watch, setValue, formState: { isValid, isDirty, errors } } = useForm({
    defaultValues: {
      birth_date: null,
      first_name: "",
      last_name: "",
      adress: "",
      ID_code: null
    }
  })

  const underFifteen = (watch("birth_date") &&
    dayjs()
      .subtract(15, "years")
      .isSameOrBefore(dayjs(watch("birth_date")))) as any;

  const onSubmit = (data: any) => {
    console.log(data)
    reset(data)
    createFamilyAccount({ ...data, email: user.email }).then(({ success, msg }) => {
      if (success) toast.success("Účet úspěšně vytvořen")
      else toast.error(msg || "Něco se nepovedlo")
      push("/user/list")
      refresh()
    })
  }

  const handleAutoAdress = (_: any, value: any) => {
    if (value) {
      setAutoAdress(user.adress)
      setValue("adress", user.adress, { shouldDirty: true, shouldValidate: true })
    }
    else {
      setAutoAdress("")
      setValue("adress", '', { shouldDirty: true, shouldValidate: true })
    }
  }

  useEffect(() => {
    if (underFifteen) {
      setValue("ID_code", null, { shouldDirty: true, shouldValidate: true })
    }
  }, [underFifteen])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 max-w-[420px] gap-3">
      <TextField label="Křestní jméno" {...register("first_name", { required: true })} />
      <TextField label="Příjmení" {...register("last_name", { required: true })} />
      <Controller control={control} name="birth_date" rules={{ required: true }} render={({ field }) => (
        <DatePicker {...field} label="Datum narození" format="DD. MM. YYYY" />
      )} />
      <Controller control={control} rules={{ required: !underFifteen, pattern: { value: /^\d{9}$/, message: "Číslo OP musí být ve správném formátu" } }} name="ID_code" render={({ field }) => (
        <TextField {...field} label="Číslo OP" helperText="Pro děti do 15 let nepovinné" disabled={!watch("birth_date") || underFifteen} />
      )} />
      <div className="col-span-2">
        <Controller control={control} name="adress" rules={{ required: true }} render={({ field }) => (
          <TextField {...field} fullWidth label="Adresa" disabled={Boolean(autoAdress.length)} />
        )} />
        <FormControlLabel className="pl-2" onChange={handleAutoAdress} control={<Checkbox />} label={`Adresa osoby je stejná jako moje`} />
      </div>
      <Button className="col-span-2" variant="contained" disabled={!isValid || !isDirty} type="submit">Uložit</Button>
    </form>
  )
}
