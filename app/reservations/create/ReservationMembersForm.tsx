import { Group } from "@/types";
import { Paper, Typography } from "@mui/material";
import { User } from "next-auth";

export default function ReservationMembersForm({
  groups,
  users,
}: {
  groups: Group[];
  users: User[];
}) {
  console.log(groups, users);
  return (
    <Paper className="p-2">
      <Typography variant="h5">Účastníci: 0</Typography>
      <Typography variant="h6">Skupiny</Typography>
      <Typography variant="h6">Uživatelé</Typography>
    </Paper>
  );
}
