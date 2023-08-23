"use client";
import {
  Box,
  Button,
  Dialog,
  FormControlLabel,
  Modal,
  Slide,
  Switch,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LogoutIcon from "@mui/icons-material/Logout";
import { store } from "@/store/store";
import { signOut } from "next-auth/react";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  paper: {
    position: "absolute",
    top: "0px",
    left: "0px",
    minHeight: "100%",
    height: "100%",
  },
});

export default function SlidingPanel() {
  const { panel, setPanel, darkMode, toggleDarkMode } = store();
  const classes = useStyles();
  return (
    <Dialog
      classes={{
        paper: classes.paper,
      }}
      sx={{ ".MuiPaper-root": { margin: 0 } }}
      open={panel}
      onClose={() => setPanel(false)}
    >
      <div className="flex flex-col justify-between h-full">
        <MenuList>
          <MenuItem className="flex gap-2">
            <ListItemIcon>
              <AccountCircleIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="h6">Můj profil</Typography>
            </ListItemText>
          </MenuItem>
          <MenuItem className="flex gap-2" onClick={toggleDarkMode}>
            <ListItemIcon>
              <DarkModeIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="h6">Tmavý mód</Typography>
            </ListItemText>
            <Switch checked={darkMode} />
          </MenuItem>
        </MenuList>
        <MenuList>
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
