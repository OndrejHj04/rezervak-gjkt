"use client";
import { store } from "@/store/store";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";

export default function HandleMenu() {
  const { setPanel, panel } = store();

  return (
    <IconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label="menu"
      sx={{ mr: 2 }}
      onClick={() => setPanel(true)}
    >
      <MenuIcon />
    </IconButton>
  );
}
