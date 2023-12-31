"use client";
import { setTheme } from "@/app/admin/actions/actionts";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { IconButton } from "@mui/material";
import { useSession } from "next-auth/react";

const handleSetTheme = ({ theme, id }: { theme: any; id: any }) => {
  setTheme(theme, id).then(() => window.location.reload());
};

export default function DarkModeToggle({ theme, id }: { theme: any; id: any }) {
  const { status } = useSession();
  if (status === "unauthenticated") return null;
  return (
    <IconButton onClick={() => handleSetTheme({ theme, id })}>
      {theme ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
}
