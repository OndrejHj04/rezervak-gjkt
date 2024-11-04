import { getSendMailDetail } from "@/lib/api"
import MailDetailForm from "./MailDetailForm"
import React from "react"
import { Typography } from "@mui/material"

export default async function Page({ params: { id } }: any) {
  const { data } = await getSendMailDetail(id)

  return (
    <React.Fragment>
      <Typography variant="h5" className="mb-2">
        Detail odeslaného emailu
      </Typography>
      <MailDetailForm data={data} />
    </React.Fragment>
  )
}
