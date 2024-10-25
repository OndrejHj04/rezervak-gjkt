"use client"

import { allowReservationSignIn, cancelRegistration } from "@/lib/api"
import { Button, CircularProgress, FormControlLabel, Switch } from "@mui/material"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { toast } from "react-toastify"

export default function GoogleFormButton({ reservation }: { reservation: any }) {
  const [loading, setLoading] = useState(false)
  const { refresh } = useRouter()
  const on = reservation.form.id && reservation.form.publicUrl

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
      cancelRegistration({ formId: reservation.form.id }).then(({ success }) => {
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
      <FormControlLabel control={<Switch disabled={loading} checked={on} />} onChange={handleToggle} label="Přihlašování na rezervaci" />
      <Button variant="outlined" disabled={!on || loading} LinkComponent={Link} target="_blank" href={reservation.form.publicUrl}>Přihlašovací formulář</Button>
    </div>
  )
}
