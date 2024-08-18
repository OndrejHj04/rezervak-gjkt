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

export default function SlidingMenu({
  menuConfig,
  version,
}: {
  menuConfig: any;
  version: any;
}) {
  const { status } = useSession();

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
                <Icon fontSize="large" color="primary">
                  {item.icon}
                </Icon>
                <Typography variant="h6" style={{ margin: "0 0 0 10px" }}>
                  {item.name}
                </Typography>
              </MenuItem>
            </Link>
          ))}
        </MenuList>

        <MenuItem
          disabled={status === "unauthenticated"}
          onClick={() => signOut({ callbackUrl: "/", redirect: true })}
        >
          <LogoutIcon fontSize="large" color="error" />
          <Typography variant="h6" style={{ margin: "0 0 0 10px" }}>
            Odhlásit se
          </Typography>
        </MenuItem>
      </div>
      <Link
        className="text-xs text-center no-underline text-inherit"
        href="/verzovnik"
      >
        {version}
      </Link>
    </Drawer>
  );
}
