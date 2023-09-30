"use client";
import * as React from "react";
import Drawer from "@mui/material/Drawer";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { store } from "@/store/store";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { navConfig } from "@/lib/navigationConfig";

export default function SlidingMenu() {
  const { panel, setPanel, user, userLoading } = store();
  const { push } = useRouter();

  const redirect = (string: string) => {
    push(string);
    setPanel(false);
  };

  return (
    <Drawer anchor="left" open={panel} onClose={() => setPanel(false)}>
      <div className="h-full flex flex-col justify-between">
        <MenuList>
          {navConfig.map((route, i) => {
            if (
              route.roles.includes(user?.role.role_id!) ||
              route.roles.length === 0
            ) {
              return (
                <MenuItem
                  onClick={() => redirect(route.path)}
                  key={i}
                  disabled={Boolean(!user?.verified && route.roles.length)}
                >
                  <ListItemIcon>{route.icon}</ListItemIcon>
                  <ListItemText>
                    <Typography variant="h6">{route.name}</Typography>
                  </ListItemText>
                </MenuItem>
              );
            }
          })}
        </MenuList>

        <MenuList>
          <MenuItem onClick={() => signOut()} disabled={!user && !userLoading}>
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
