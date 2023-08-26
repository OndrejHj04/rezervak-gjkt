"use client";
import { store } from "@/store/store";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function HandleMenu() {
  const path = usePathname();

  useEffect(() => {
    store.setState({ panel: false });
  }, [path]);
  return (
    <IconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label="menu"
      sx={{ mr: 2 }}
      onClick={() => store.setState({ panel: true })}
    >
      <MenuIcon />
    </IconButton>
  );
}
