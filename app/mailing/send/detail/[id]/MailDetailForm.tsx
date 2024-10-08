"use client"

import { Paper, TextField } from "@mui/material"
import dayjs from "dayjs"

export default function MailDetailForm({ data }: any) {
  console.log(data)

  return (
    <Paper className="flex flex-col gap-3 p-3">
      <div className="flex gap-2">
        <TextField inputProps={{ readOnly: true }} value={data.subject} fullWidth label="Předmět" />
        <TextField label="Odesláno dne" value={dayjs(data.date).format("DD. MM. YYYY hh:mm")} />
      </div>
      <TextField inputProps={{ readOnly: true }} multiline value={data.recipients} fullWidth label="Adresáti" />
      <TextField inputProps={{ readOnly: true }} value={data.content} fullWidth multiline rows={10} label="Zpráva" />
    </Paper>
  )
}
