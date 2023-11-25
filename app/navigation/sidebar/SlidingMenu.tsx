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
import { signOut } from "next-auth/react";
import { navConfig } from "@/lib/navigationConfig";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CollectionsIcon from "@mui/icons-material/Collections";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GroupIcon from "@mui/icons-material/Group";
import DateRangeIcon from "@mui/icons-material/DateRange";
import Link from "next/link";

const icons = [
  DashboardIcon,
  CollectionsIcon,
  AdminPanelSettingsIcon,
  FormatListBulletedIcon,
  GroupIcon,
  DateRangeIcon,
];

export default function SlidingMenu() {
  const { panel, setPanel, user, userLoading } = store();

  return (
    <Drawer anchor="left" open={panel} onClose={() => setPanel(false)}>
      <div className="h-full flex flex-col justify-between">
        <MenuList>
          {navConfig.map((route, i) => {
            if (
              route.roles.includes(user?.role.id!) ||
              route.roles.length === 0
            ) {
              return (
                <Link
                  href={route.path}
                  onClick={() => setPanel(false)}
                  key={i}
                  className="no-underline text-inherit"
                >
                  <MenuItem
                    disabled={Boolean(!user?.verified && route.roles.length)}
                  >
                    <ListItemIcon sx={{ marginRight: 1 }}>
                      {React.createElement(icons[i], {
                        fontSize: "large",
                        color: "primary",
                      })}
                    </ListItemIcon>
                    <ListItemText>
                      <Typography variant="h6">{route.name}</Typography>
                    </ListItemText>
                  </MenuItem>
                </Link>
              );
            }
          })}
        </MenuList>

        <MenuList>
          <MenuItem onClick={() => signOut()} disabled={!user && !userLoading}>
            <ListItemIcon sx={{ marginRight: 1 }}>
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
