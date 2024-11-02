"use client"

import { cancelRegistration } from "@/lib/api"
import { Button, CircularProgress } from "@mui/material"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"

export default function CancelRegistrationButton({ formId }: { formId: any }) {
  const [loading, setLoading] = useState(false)
  const { refresh } = useRouter()

  const handleCancel = () => {
    setLoading(true)
    cancelRegistration({ formId }).then(({ success }) => {
      if (success) toast.success("Přihlašování na rezervaci úspěšně zastaveno")
      else toast.error("Něco se nepovedlo")
      refresh()
    })
  }

  return (
    <div className="flex items-center justify-end">
      {loading && <CircularProgress size={24} />}
      <Button disabled={loading} size="small" color="error" onClick={handleCancel}>Ukončit přihlašování</Button>
    </div>
  )
}
