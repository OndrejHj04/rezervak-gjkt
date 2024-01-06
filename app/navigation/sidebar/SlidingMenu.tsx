"use client";
import * as React from "react";
import Drawer from "@mui/material/Drawer";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { store } from "@/store/store";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { Icon, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function SlidingMenu({ menuConfig }: { menuConfig: any }) {
  const { panel, setPanel } = store();

  return (
    <Drawer anchor="left" open={panel} onClose={() => setPanel(false)}>
      <div className="h-full flex flex-col justify-between">
        <MenuList>
          {menuConfig.map((item: any) => (
            <Link
              href={item.path}
              onClick={() => setPanel(false)}
              key={item.name}
              className="no-underline text-inherit"
            >
              <MenuItem key={item.name}>
                <ListItemIcon>
                  <Icon fontSize="large" color="primary">
                    {item.icon}
                  </Icon>
                </ListItemIcon>
                <ListItemIcon>
                  <Typography variant="h6">{item.name}</Typography>
                </ListItemIcon>
              </MenuItem>
            </Link>
          ))}
        </MenuList>

        <MenuList>
          <MenuItem onClick={() => signOut()}>
            <ListItemIcon sx={{ marginRight: 1 }}>
              <LogoutIcon fontSize="large" color="error" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="h6">Odhlásit se</Typography>
            </ListItemText>
          </MenuItem>
        </MenuList>
      </div>
      <Typography className="text-center">
        Made with 💘 by Ondřej Hájek
      </Typography>
    </Drawer>
  );
}
