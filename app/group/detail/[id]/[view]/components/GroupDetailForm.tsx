"use client"

import { editGroupDetail } from "@/lib/api"
import AvatarWrapper from "@/ui-components/AvatarWrapper"
import { Button, CardHeader, Divider, TextField, Typography } from "@mui/material"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

export default function GroupDetailForm({ groupDetail }: { groupDetail: any }) {
  const { register, handleSubmit, formState: { isValid, isDirty }, reset } = useForm({
    defaultValues: {
      name: groupDetail.name,
      description: groupDetail.description
    }
  })

  const onSubmit = (data: any) => {
    editGroupDetail({ groupId: groupDetail.id, name: data.name, description: data.description }).then(({ success }) => {
      if (success) toast.success("Detail skupiny úspěšně upraven")
      else toast.error("Něco se nepovedlo")
    })
    reset(data)
  }

  return (
    <div className="flex items-start gap-3">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 my-2">
        <TextField label="Název" {...register("name", { required: true })} />
        <TextField label="Popis" {...register("description")} multiline minRows={4} maxRows={4} />
        <Button type="submit" variant="outlined" disabled={!isValid || !isDirty}>Uložit</Button>
      </form>
      <Divider flexItem orientation="vertical" />
      <div>
        <Typography variant="h6">Vedoucí skupiny:</Typography>
        <CardHeader
          className="!p-0"
          avatar={<AvatarWrapper data={{ image: groupDetail.owner_image }} size={56} />}
          title={
            <Typography variant="h5">
              {groupDetail.owner_name}
            </Typography>
          }
          subheader={groupDetail.owner_email}
        />
      </div>
    </div>
  )
}
