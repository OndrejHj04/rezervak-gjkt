"use client";
import Drawer from "@mui/material/Drawer";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { Icon, Typography } from "@mui/material";
import { signOut } from "next-auth/react";
import Link from "next/link";
import changelog from "@/app/changelog/changelog.data"
import { PanelContext } from "@/app/clientProvider";
import { useContext } from "react";

export default function SlidingMenu({
  menuConfig,
  user
}: {
  menuConfig: any;
  user: any
}) {
  const currentVersion = changelog.versions[0].title
  const { panel, setPanel } = useContext(PanelContext)

  return (
    <Drawer anchor="left" open={panel} onClose={() => setPanel(false)}>
      <div className="h-full flex flex-col justify-between">
        <MenuList>
          {menuConfig.map((item: any) => (
            <MenuItem key={item.name} component={Link} href={item.href[0]} onClick={() => setPanel(false)}>
              <Icon fontSize="large" color="primary">
                {item.icon}
              </Icon>
              <Typography variant="h6" style={{ margin: "0 0 0 10px" }}>
                {item.name}
              </Typography>
            </MenuItem>
          ))}
        </MenuList>

        <MenuItem
          disabled={!user}
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
        href="/changelog"
      >
        {currentVersion}
      </Link>
    </Drawer>
  );
}
