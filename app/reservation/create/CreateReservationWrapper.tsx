import { Typography } from "@mui/material";
import ReservationMembers from "./components/ReservationMembers/ReservationMembers";
import ReservationDates from "./components/ReservationDates/ReservationDates";
import CreateButton from "./CreateButton";
import ReservationRooms from "./components/ReservationRooms/ReservationRooms";
import ReservationDetail from "./components/ReservationDetail/ReservationDetail";
export default function CreateReservationWrapper({
  searchParams,
}: {
  searchParams: any;
}) {
  const { users, groups, upage, gpage } = searchParams;

  return (
    <div className="flex flex-col">
      <div className="flex justify-between mb-2 items-center">
        <Typography variant="h4">Nová rezervace</Typography>
        <CreateButton />
      </div>
      <ReservationDates />
      <ReservationMembers
        users={users || ""}
        groups={groups || ""}
        upage={upage}
        gpage={gpage}
      />
      <ReservationRooms />
      <ReservationDetail />
    </div>
  );
}
