import { Typography } from "@mui/material";
import ReservationMembers from "./components/ReservationMembers/ReservationMembers";
import ReservationDates from "./components/ReservationDates/ReservationDates";
import CreateButton from "./CreateButton";
export default function CreateReservationWrapper() {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between mb-2 items-center">
        <Typography variant="h4">Nová rezervace</Typography>
        <CreateButton />
      </div>
      <ReservationDates />
      <ReservationMembers />
    </div>
  );
}
