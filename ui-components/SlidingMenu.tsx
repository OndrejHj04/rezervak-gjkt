"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import { store } from "@/store/store";

const list = [
  { text: "Inbox", icon: <InboxIcon /> },
  { text: "Drafts", icon: <DraftsIcon /> },
];

export default function SlidingMenu() {
  const { panel, setPanel } = store();

  return (
    <Drawer anchor="left" open={panel} onClose={() => setPanel(false)}>
      <List>
        {list.map(({ text, icon }, i) => (
          <ListItem disablePadding key={i}>
            <ListItemButton>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
