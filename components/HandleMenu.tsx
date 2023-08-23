"use client";
import { useBearStore } from "@/store/store";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";

export default function HandleMenu() {
  const { setPanel, panel } = useBearStore();

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
