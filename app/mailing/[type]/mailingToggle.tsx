"use client"

import { toggleEmailSettings } from "@/lib/api"
import { FormControlLabel, Switch } from "@mui/material"
import { toast } from "react-toastify"

export default function MailingToggle({ allowMails }: { allowMails: any }) {

  const handleChange = (e: any) => {
    toggleEmailSettings(e.target.checked).then(({ success }) => {
      if (success) toast.success("Nastevení odesílání emailů úspěšně změněno")
      else toast.success("Něco se nepovedlo")
    })
  }

  return (
    <FormControlLabel control={<Switch defaultChecked={allowMails} />} onChange={handleChange} label="Odesílání emailů" />
  )
}
