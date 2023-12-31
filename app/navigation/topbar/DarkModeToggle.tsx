"use client";
import { setTheme } from "@/app/admin/actions/actionts";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { IconButton } from "@mui/material";

const handleSetTheme = ({ theme, id }: { theme: any; id: any }) => {
  setTheme(theme, id).then(() => window.location.reload());
};

export default function DarkModeToggle({ theme, id }: { theme: any; id: any }) {
  return (
    <IconButton onClick={() => handleSetTheme({ theme, id })}>
      {theme ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
}
