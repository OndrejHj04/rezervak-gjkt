import CustomEditor from "@/app/mailing/CustomEditor"
import { Paper, TextField } from "@mui/material"
import dayjs from "dayjs"

export default function MailDetailForm({ data }: any) {

  return (
    <Paper className="flex flex-col gap-3 p-2">
      <div className="flex gap-2">
        <TextField slotProps={{ input: { readOnly: true } }} value={data.subject} fullWidth label="Předmět" />
        <TextField label="Odesláno dne" value={dayjs(data.date).format("DD. MM. YYYY HH:mm")} />
      </div>
      <TextField slotProps={{ input: { readOnly: true } }} multiline value={data.recipients} fullWidth label="Adresáti" />
      <CustomEditor value={data.content} init={{ editable_root: false }} />
    </Paper>
  )
}
