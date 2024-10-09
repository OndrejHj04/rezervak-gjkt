"use client"

import CustomEditor from "@/app/mailing/CustomEditor"
import { Paper, TextField, Typography } from "@mui/material"
import dayjs from "dayjs"

export default function MailDetailForm({ data }: any) {

  return (
    <Paper className="flex flex-col gap-3 p-2">
      <Typography variant="h5">
        Detail odeslaného emailu
      </Typography>
      <div className="flex gap-2">
        <TextField inputProps={{ readOnly: true }} value={data.subject} fullWidth label="Předmět" />
        <TextField label="Odesláno dne" value={dayjs(data.date).format("DD. MM. YYYY hh:mm")} />
      </div>
      <TextField inputProps={{ readOnly: true }} multiline value={data.recipients} fullWidth label="Adresáti" />
      <CustomEditor value={data.content} init={{ editable_root: false }} />
    </Paper>
  )
}
