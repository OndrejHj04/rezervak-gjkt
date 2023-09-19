import { Paper, Typography } from "@mui/material";
import { getServerSession } from "next-auth";

export default async function AuthComponent() {
  const session = await getServerSession();
  console.log(session);
  return (
    <Paper className="flex flex-col p-2">
      <Typography variant="h5">Stav přihlášení</Typography>
      {session ? "" : "Uživatel není přihlášen"}
    </Paper>
  );
}
