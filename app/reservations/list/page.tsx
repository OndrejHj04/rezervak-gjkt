import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import CheckboxComponent from "./components/CheckboxComponent";
import UserListItem from "@/app/user/list/UserListItem";
import { Reservation } from "@/types";
import ReservationListItem from "./components/ReservationListItem";

const getReservations = async () => {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/reservations/list`,
    { cache: "no-cache" }
  );
  const { data } = await req.json();
  return data as Reservation[];
};

export default async function ReservationsListPage() {
  const reservations = await getReservations();
  console.log(reservations);
  return (
    <div className="flex flex-col w-full gap-2">
      <Paper className="w-full p-2">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <CheckboxComponent reservations={reservations} />
              </TableCell>
              <TableCell></TableCell>
              <TableCell sx={{ padding: 1.5 }}>
                <Chip label="Jméno" />
              </TableCell>
              <TableCell sx={{ padding: 1.5 }}>
                <Chip label="Email" />
              </TableCell>
              <TableCell sx={{ padding: 1.5 }}>
                <Chip label="Role" />
              </TableCell>
              <TableCell sx={{ padding: 1.5 }}>
                <Chip label="Datum narození" />
              </TableCell>
              <TableCell sx={{ padding: 1.5 }}>
                <Chip label="Ověřený účet" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((reservation) => (
              <ReservationListItem
                key={reservation.id}
                reservation={reservation}
              />
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
