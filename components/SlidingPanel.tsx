"use client";
import {
  Box,
  Button,
  FormControlLabel,
  Modal,
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
import EventIcon from "@mui/icons-material/Event";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LogoutIcon from "@mui/icons-material/Logout";

export default function SlidingPanel() {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        className="outline-none"
      >
        <Paper className="absolute h-full border-0 outline-none flex flex-col justify-between">
          <MenuList>
            <MenuItem className="flex gap-2">
              <ListItemIcon>
                <EventIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="h6">Moje rezervace</Typography>
              </ListItemText>
            </MenuItem>
            <MenuItem className="flex gap-2">
              <ListItemIcon>
                <DarkModeIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="h6">Tmavý mód</Typography>
              </ListItemText>
              <Switch />
            </MenuItem>
          </MenuList>

          <MenuList>
            <MenuItem className="flex gap-2">
              <ListItemIcon>
                <LogoutIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="h6">Odhlásit se</Typography>
              </ListItemText>
            </MenuItem>
          </MenuList>
        </Paper>
      </Modal>
    </div>
  );
}
