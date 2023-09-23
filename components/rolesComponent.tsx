import RoleSmallCard from "@/sub-components/RoleSmallCard";
import { Role } from "@/types";
import { Paper, Typography } from "@mui/material";

const getRoles = async () => {
  const req = await fetch("http://localhost:3000/api/roles/list");
  const { data } = await req.json();
  return data as Role[];
};

export default async function RolesComponent() {
  const roles = await getRoles();

  return (
    <>
      <Paper className="flex flex-col p-2 gap-2 h-min">
        <Typography variant="h5">Správa rolí</Typography>
        {roles.map((role) => (
          <RoleSmallCard key={role.id} role={role} />
        ))}
      </Paper>
    </>
  );
}
