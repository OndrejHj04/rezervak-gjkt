"use client";
import { setTheme } from "@/lib/api";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { IconButton } from "@mui/material";

const handleSetTheme = ({ theme, id }: { theme: any; id: any }) => {
  setTheme(theme, id).then(() => window.location.reload());
};

export default function DarkModeToggle({ theme, user }: { theme: any; user: any }) {
  if (!user) return null

  return (
    <IconButton onClick={() => handleSetTheme({ theme, id: user.id })}>
      {theme ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
}
