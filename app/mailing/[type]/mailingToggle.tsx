"use client"

import { toggleEmailSettings } from "@/lib/api"
import { withToast } from "@/utils/toast/withToast"
import { FormControlLabel, Switch } from "@mui/material"

export default function MailingToggle({ allowMails }: { allowMails: any }) {

  const handleChange = (e: any) => withToast(toggleEmailSettings(e.target.checked), "mailing.toggle")

  return (
    <FormControlLabel control={<Switch defaultChecked={allowMails} />} onChange={handleChange} label="Odesílání emailů" />
  )
}
