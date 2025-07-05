"use client"
import { IconButton, } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import { PanelContext } from "@/app/clientProvider"
import { useContext } from "react"

export default function SideMenuButton({ user }: { user: any }) {
  const { setPanel } = useContext(PanelContext)

  return (
    <IconButton
      disabled={!user}
      onClick={() => setPanel(true)}
    >
      <MenuIcon />
    </IconButton>
  )
}
