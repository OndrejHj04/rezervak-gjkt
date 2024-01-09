import { Paper, Typography } from "@mui/material";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import BlockDatesForm from "./BlockDatesForm";

const getReservations = async () => {
  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reservations/list`
    );
    const { data } = await req.json();
    return data;
  } catch (e) {
    return [];
  }
};

export default async function BlockDates({ user }: { user: any }) {
  const reservations = await getReservations();
  return (
    <Paper className="p-2 flex flex-col">
      <div className="flex justify-between items-center gap-3">
        <DoDisturbIcon color="primary" />
        <Typography variant="h5">Zablokovat termín</Typography>
        <DoDisturbIcon color="primary" />
      </div>
      <BlockDatesForm reservations={reservations} userId={user.user.id} />
    </Paper>
  );
}
