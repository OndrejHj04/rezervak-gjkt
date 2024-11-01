"use client"

import { reservationDeleteUser } from "@/lib/api"
import { Button } from "@mui/material"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

export default function ReservationUsersRemoveButton({ reservationId, userId }: { reservationId: any, userId: any }) {
  const { refresh } = useRouter()
  const handleRemoveUserFromReservation = () => {
    reservationDeleteUser({ userId, reservationId }).then(({ success }) => {
      if (success) toast.success("Uživatel úspěšně odstraněn z rezervace")
      else toast.error("Něco se nepovedlo")
      refresh()
    })
  }

  return (
    <Button size="small" variant="text" color="error" onClick={handleRemoveUserFromReservation}>Odstranit uživatele</Button>
  )
}
