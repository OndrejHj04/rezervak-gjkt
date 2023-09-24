"use client";
import * as React from "react";
import Drawer from "@mui/material/Drawer";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { store } from "@/store/store";
import ContentCut from "@mui/icons-material/ContentCut";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";

export default function SlidingMenu() {
  const { panel, setPanel } = store();
  const { data, status } = useSession();

  return (
    <Drawer anchor="left" open={panel} onClose={() => setPanel(false)}>
      <div className="h-full flex flex-col justify-between">
        <MenuList>
          <MenuItem>
            <ListItemIcon>
              <ContentCut />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="h6">Cutti n</Typography>
            </ListItemText>
          </MenuItem>
        </MenuList>

        <MenuList>
          <MenuItem
            onClick={() => signOut()}
            disabled={status !== "authenticated"}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="large" color="error" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="h6">Odhlásit se</Typography>
            </ListItemText>
          </MenuItem>
        </MenuList>
      </div>
    </Drawer>
  );
}
