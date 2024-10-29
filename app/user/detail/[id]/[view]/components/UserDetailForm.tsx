"use client"

import { editUserDetail } from "@/lib/api"
import AvatarWrapper from "@/ui-components/AvatarWrapper"
import { Button, CardHeader, List, ListItem, ListItemText, MenuItem, TextField, Typography } from "@mui/material"
import dayjs from "dayjs"
import React from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

export default function UserDetailForm({ userDetail }: { userDetail: any }) {

  const { watch, handleSubmit, register, reset, formState: { isValid, isDirty } } = useForm({
    defaultValues: {
      ID_code: userDetail.ID_code,
      adress: userDetail.adress,
      organization: userDetail.organization_id
    }
  })

  const onSubmit = (data: any) => {
    editUserDetail({ userId: userDetail.id, ID_code: data.ID_code, adress: data.adress, organization: data.organization }).then(({ success }) => {
      if (success) toast.success("Detail uživatele úspěšně upraven")
      else toast.error("Něco se nepovedlo")
      reset(data)
    })
  }

  return (
    <div>
      <CardHeader
        className="!p-0"
        avatar={<AvatarWrapper data={{ image: userDetail.image }} size={56} />}
        title={
          <Typography variant="h5">
            {userDetail.name}
          </Typography>
        }
        subheader={userDetail.email}
      />
      <List className="w-fit">
        <ListItem disablePadding>
          <ListItemText>Role: {userDetail.role}</ListItemText>
        </ListItem>
        <ListItem disablePadding>
          <ListItemText>Datum narození: {dayjs(userDetail.birth_date).format("DD. MMMM YYYY")}</ListItemText>
        </ListItem>
      </List>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 w-[300px]">
        <TextField label="Číslo OP" {...register("ID_code", { required: true })} />
        <TextField label="Adresa" {...register("adress", { required: true })} />
        <TextField select {...register("organization")} defaultValue={userDetail.organization_id} label="Organizace">
          <MenuItem value={1}>ZO</MenuItem>
          <MenuItem value={2}>Zaměstnanec</MenuItem>
          <MenuItem value={3}>Veřejnost</MenuItem>
        </TextField>
        <Button variant="outlined" type="submit" disabled={!isValid || !isDirty}>Uložit</Button>
      </form>
    </div>
  )
}
