"use client"

import { deleteUser } from "@/lib/api"
import { Button } from "@mui/material"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

export default function UserRejectButton({ userId, reservationId }: { userId: any, reservationId: any }) {
  const { refresh } = useRouter()

  const handleReject = () => {
    deleteUser({ userId, reservationId }).then(({ success }) => {
      if (success) toast.success("Uživatel úspěšně odebrán z rezervace")
      else toast.success("Něco se nepovedlo")
      refresh()
    })
  }

  return (
    <Button onClick={handleReject} variant="text" size="small" color="error">Zamítnout</Button>
  )
}
