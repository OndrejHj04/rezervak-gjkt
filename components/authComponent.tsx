import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Paper,
  Typography,
} from "@mui/material";
import { getServerSession } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import LogoutButton from "./logoutButton";
import LoginButton from "./loginButton";

export default async function AuthComponent() {
  const session = await getServerSession(authOptions);

  return (
    <Paper className="flex flex-col p-2">
      <Typography variant="h5">Stav přihlášení</Typography>
      {session ? (
        <div className="flex gap-2">
          {session.user.image ? (
            <Image
              src={session.user.image}
              width={70}
              height={70}
              alt=""
              className="rounded-full"
            />
          ) : (
            <Avatar sx={{ width: 70, height: 70 }} />
          )}
          <div>
            <Typography variant="h6">{session.user.name}</Typography>
            <Typography variant="body2">{session.user.email}</Typography>
            <div>
              <Chip
                sx={{
                  backgroundColor: session.user.role.role_color,
                  marginBlock: 0.5,
                }}
                label={
                  <Typography variant="body2">
                    #{session.user.role.role_name}
                  </Typography>
                }
              />
            </div>
            <LogoutButton />
          </div>
        </div>
      ) : (
        <div>
          <Typography>Uživatel není přihlášen</Typography>
          <LoginButton />
        </div>
      )}
    </Paper>
  );
}
