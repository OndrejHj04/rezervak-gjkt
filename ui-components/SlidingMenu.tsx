"use client";
import * as React from "react";
import Drawer from "@mui/material/Drawer";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { store } from "@/store/store";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardIcon from "@mui/icons-material/Dashboard";

export default function SlidingMenu() {
  const { panel, setPanel } = store();
  const { data, status } = useSession();
  const { push } = useRouter();
  return (
    <Drawer anchor="left" open={panel} onClose={() => setPanel(false)}>
      <div className="h-full flex flex-col justify-between">
        <MenuList>
          <MenuItem onClick={() => push("/user/list")}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="h6">Přehled</Typography>
            </ListItemText>
          </MenuItem>
          <MenuItem onClick={() => push("/user/list")}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="h6">Seznam uživatelů</Typography>
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
