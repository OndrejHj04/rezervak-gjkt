"use client";
import {
  Box,
  Button,
  Dialog,
  FormControlLabel,
  Modal,
  Switch,
  Typography,
  makeStyles,
} from "@mui/material";
import { forwardRef } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LogoutIcon from "@mui/icons-material/Logout";
import { store } from "@/store/store";
import { signOut, useSession } from "next-auth/react";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { useRouter } from "next/navigation";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="right" ref={ref} {...props} />;
});

export default function SlidingPanel() {
  const { data: session, status } = useSession();
  const { panel, user, toggleTheme } = store();
  const navigation = useRouter();
  const setSwitch = user.theme === "dark" ? true : false;
  const handleTheme = () => {
    if (session?.user?.email) {
      toggleTheme(session.user.email);
    }
  };
  return (
    <Dialog
      TransitionComponent={Transition}
      sx={{
        ".MuiPaper-root": {
          margin: 0,
          position: "absolute",
          top: 0,
          minHeight: "100%",
          height: "100%",
          left: 0,
        },
      }}
      open={panel}
      onClose={() => store.setState({ panel: false })}
      transitionDuration={500}
    >
      <div className="flex flex-col justify-between h-full">
        <MenuList>
          <MenuItem className="flex gap-2" onClick={() => navigation.push("/")}>
            <ListItemIcon>
              <DashboardIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="h6">Přehled</Typography>
            </ListItemText>
          </MenuItem>
          <MenuItem
            className="flex gap-2"
            onClick={() => navigation.push("/profile")}
          >
            <ListItemIcon>
              <AccountCircleIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="h6">Můj profil</Typography>
            </ListItemText>
          </MenuItem>
        </MenuList>
        <MenuList>
          <MenuItem
            className="flex gap-2"
            disabled={!session}
            onClick={handleTheme}
          >
            <ListItemIcon>
              <DarkModeIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="h6">Tmavý mód</Typography>
            </ListItemText>
            <Switch checked={setSwitch} />
          </MenuItem>
          <MenuItem className="flex gap-2" onClick={() => signOut()}>
            <ListItemIcon>
              <LogoutIcon fontSize="large" color="error" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="h6">Odhlásit se</Typography>
            </ListItemText>
          </MenuItem>
        </MenuList>
      </div>
    </Dialog>
  );
}
