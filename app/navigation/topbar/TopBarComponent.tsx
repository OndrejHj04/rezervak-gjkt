"use client";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { store } from "@/store/store";
import LoginButton from "./LoginButton";
import DarkModeToggle from "./DarkModeToggle";
import Link from "next/link";

export default function TopBarComponent({ theme, id }: any) {
  const { setPanel } = store();
  return (
    <AppBar position="static">
      <Toolbar className="!min-h-0 !p-0 !pl-2 flex">
        <div className="flex-1 flex justify-start items-center">
          <IconButton
            onClick={() => setPanel(true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component={Link}
            href="/"
            className="text-inherit no-underline"
          >
            Chata GJKT
          </Typography>
        </div>
        <div className="flex flex-col">
{          /* <Typography variant="body2">V Krkonoších teď prší a je  10 °C</Typography> */}
        </div>
        <div className="flex-1 flex justify-end">
          <DarkModeToggle theme={theme} id={id} />
          <LoginButton />
        </div>
      </Toolbar>
    </AppBar>
  );
}
