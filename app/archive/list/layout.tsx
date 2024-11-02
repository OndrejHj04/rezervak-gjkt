import { Paper } from "@mui/material"
import React from "react"

export default function UserListLayout({ children }: { children: React.ReactNode }) {

  return (
    <Paper>
      {children}
    </Paper>
  )
}
