"use client"

import { allowReservationSignIn, cancelRegistration } from "@/lib/api"
import {
  Button, CircularProgress, FormControlLabel, Switch, Tooltip, Typography
} from "@mui/material"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { toast } from "react-toastify"

export default function ReservationRegistrationToggle({ reservation, disabled, conflicts }: { reservation: any, disabled: any, conflicts: any }) {
  console.log(reservation)
  const [loading, setLoading] = useState(false)
  const { refresh } = useRouter()
  const on = reservation.form_id && reservation.form_public_url

  const handleToggle = (e: any) => {
    setLoading(true)
    const { checked } = e.target

    if (checked) {
      allowReservationSignIn({ reservation }).then(({ success }) => {
        if (success) toast.success("Přihlašování na rezervaci bylo povoleno")
        else toast.error("Něco se nepovedlo")
        setLoading(false)
        refresh()
      })
    } else {
      cancelRegistration({ formId: reservation.form_id }).then(({ success }) => {
        if (success) toast.success("Přihlašování na rezervaci bylo ukončeno")
        else toast.error("Něco se nepovedlo")
        setLoading(false)
        refresh()
      })
    }
  }
  return (
    <div className="flex items-center gap-2">
      {loading && <CircularProgress size={30} />}
      <Typography variant="h5" className="mr-auto">{on ? "Registrace běží" : "Registrace vypnuta"}</Typography>
      <Tooltip {...(!conflicts && { disableFocusListener: true, disableHoverListener: true, disableTouchListener: true })} title="Přihlašování nelze ukončit dokud nejsou vyřešené všechny konflikty">
        <FormControlLabel control={<Switch disabled={loading || disabled || conflicts} checked={on} />} onChange={handleToggle} label="Zapnutá registrace" />
      </Tooltip>
      <Button variant="outlined" size="small" disabled={!on || loading} LinkComponent={Link} target="_blank" href={reservation.form_public_url}>Přihlašovací formulář</Button>
    </div >
  )
}
