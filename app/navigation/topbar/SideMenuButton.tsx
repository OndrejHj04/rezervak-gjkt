"use client"
import { IconButton, } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import { store } from "@/store/store"

export default function SideMenuButton({ user }: { user: any }) {
  const { setPanel } = store()

  return (
    <IconButton
      disabled={!user}
      onClick={() => setPanel(true)}
    >
      <MenuIcon />
    </IconButton>
  )
}
