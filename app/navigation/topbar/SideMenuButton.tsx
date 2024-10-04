"use client"
import { IconButton, } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import { store } from "@/store/store"

export default function SideMenuButton() {
  const { setPanel } = store()

  return (
    <IconButton
      onClick={() => setPanel(true)}
    >
      <MenuIcon />
    </IconButton>
  )
}
