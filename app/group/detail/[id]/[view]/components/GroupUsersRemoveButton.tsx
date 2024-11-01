"use client"

import { groupDeleteUser } from "@/lib/api"
import { Button } from "@mui/material"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

export default function GroupUsersRemoveButton({ groupId, userId }: { groupId: any, userId: any }) {
  const { refresh } = useRouter()
  const handleDeleteUserFromGroup = () => {
    groupDeleteUser({ userId, groupId }).then(({ success }) => {
      if (success) toast.success("Uživatel úspěšně odstraněn ze skupiny")
      else toast.error("Něco se nepovedlo")
      refresh()
    })
  }

  return (
    <Button size="small" color="error" onClick={handleDeleteUserFromGroup}>Odstranit uživatele</Button>
  )
}
