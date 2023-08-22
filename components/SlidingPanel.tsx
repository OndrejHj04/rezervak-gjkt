"use client";
import { Box, Button, Modal, Typography } from "@mui/material";
import { useState } from "react";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ContentCut from "@mui/icons-material/ContentCut";
import ContentCopy from "@mui/icons-material/ContentCopy";
import ContentPaste from "@mui/icons-material/ContentPaste";
import EventIcon from "@mui/icons-material/Event";

export default function SlidingPanel() {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        className="outline-none"
      >
        <Paper className="absolute h-full border-0 outline-none">
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
                <EventIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="h6">Rezervace</Typography>
              </ListItemText>
            </MenuItem>
            <MenuItem className="flex gap-2">
              <ListItemIcon>
                <EventIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="h6">Rezervace</Typography>
              </ListItemText>
            </MenuItem>
          </MenuList>
        </Paper>
      </Modal>
    </div>
  );
}
