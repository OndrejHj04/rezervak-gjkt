"use client";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { store } from "@/store/store";
import { Avatar, Popover, Skeleton } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function TopBar() {
  const { setPanel } = store();
  const { data, status } = useSession();
  console.log(data);
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => setPanel(true)}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Rezervak GJKT
        </Typography>
        {status === "loading" ? (
          <Skeleton variant="rounded" width={180} height={50} />
        ) : (
          <>
            {data ? (
              <Button>
                <div className="flex flex-col mx-4 items-end normal-case text-white">
                  <Typography
                    className="font-semibold capitalize"
                    variant="body1"
                  >
                    {data.user.name}
                  </Typography>
                  <Typography variant="body2">
                    {data.user.role.role_name}
                  </Typography>
                </div>
                <Avatar />
              </Button>
            ) : (
              <Link href="/login">
                <Button className="text-white">Přihlásit se</Button>
              </Link>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
