"use client";
import { Skeleton } from "@mui/material";
import Link from "next/link";
import AvatarWrapper from "../../../ui-components/AvatarWrapper";
import ErrorIcon from "@mui/icons-material/Error";
import HotelIcon from "@mui/icons-material/Hotel";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { store } from "@/store/store";
import { setTheme } from "@/app/admin/actions/actionts";
import { useSession } from "next-auth/react";
import LoginButton from "./LoginButton";

const handleSetTheme = (theme: any, id: any) => {
  setTheme(theme, id).then(() => window.location.reload());
};

export default function TopBarComponent({ theme, id }: any) {
  const { setPanel } = store();

  return (
    <AppBar position="static">
      <Toolbar>
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
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Rezervak GJKT
        </Typography>
        <LoginButton />
      </Toolbar>
    </AppBar>
  );
}
