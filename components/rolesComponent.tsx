import { Paper, Typography } from "@mui/material";

const getRoles = async () => {};

export default async function RolesComponent() {
  const roles = await getRoles();
  return (
    <>
      <Paper className="p-2 flex">
        <Typography variant="h5">Správa rolí</Typography>
      </Paper>
    </>
  );
}
