"use client";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { store } from "@/store/store";
import LoginButton from "./LoginButton";
import DarkModeToggle from "./DarkModeToggle";

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
        <DarkModeToggle theme={theme} id={id} />
        <LoginButton />
      </Toolbar>
    </AppBar>
  );
}
