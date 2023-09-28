"use client";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { store } from "@/store/store";
import { Skeleton } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AvatarWrapper from "./AvatarWrapper";
import ErrorIcon from "@mui/icons-material/Error";

export default function TopBar() {
  const { setPanel } = store();
  const { data, status } = useSession();

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
              <Link href={`/user/detail/${data.user.id}`}>
                <Button>
                  <div className="flex flex-col mx-4 items-end normal-case text-white">
                    <Typography
                      className="font-semibold capitalize"
                      variant="body1"
                    >
                      {data.user.first_name} {data.user.last_name}
                    </Typography>
                    <div className="flex gap-1 items-center">
                      {!data.user.verified && (
                        <ErrorIcon sx={{ color: "#ED9191" }} />
                      )}
                      <Typography variant="body2">
                        {data.user.role.role_name}
                      </Typography>
                    </div>
                  </div>
                  <AvatarWrapper />
                </Button>
              </Link>
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
