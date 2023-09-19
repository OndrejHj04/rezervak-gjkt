import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Paper, Typography } from "@mui/material";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

export default async function AuthComponent() {
  const session = await getServerSession(authOptions);
  console.log(session);
  return (
    <Paper className="flex flex-col p-2">
      <Typography variant="h5">Stav přihlášení</Typography>
      {session ? "" : "Uživatel není přihlášen"}
    </Paper>
  );
}
