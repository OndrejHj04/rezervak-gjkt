"use client"

import { approveUserInReservation } from "@/lib/api"
import { Button } from "@mui/material"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

export default function UserApproveButton({ userId, reservationId }: { userId: any, reservationId: any }) {
  const { refresh } = useRouter()

  const handleApprove = () => {
    approveUserInReservation({ userId, reservationId }).then(({ success }) => {
      if (success) toast.success("Uživatel úspěšně schválen")
      else toast.error("Něco se nepovedlo")
      refresh()
    })
  }

  return (
    <Button onClick={handleApprove} variant="text" size="small" color="success">Potvrdit</Button>
  )
}
