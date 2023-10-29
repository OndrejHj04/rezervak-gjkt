import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CheckboxComponent from "./components/CheckboxComponent";
import UserListItem from "@/app/user/list/UserListItem";
import { Reservation } from "@/types";
import ReservationListItem from "./components/ReservationListItem";
import TrashBin from "./components/TrashBin";

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

  return (
    <div className="flex flex-col w-full gap-2">
      <TrashBin />
      <Paper className="w-full p-2">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <CheckboxComponent reservations={reservations} />
              </TableCell>
              <TableCell sx={{ padding: 1.5 }}>
                <Chip label="Začátek" />
              </TableCell>
              <TableCell sx={{ padding: 1.5 }}>
                <Chip label="Konec" />
              </TableCell>
              <TableCell sx={{ padding: 1.5 }}>
                <Chip label="Důvod" />
              </TableCell>
              <TableCell sx={{ padding: 1.5 }}>
                <Chip label="Počet účastníků" />
              </TableCell>
              <TableCell sx={{ padding: 1.5 }}>
                <Chip label="Vedoucí" />
              </TableCell>
              <TableCell sx={{ padding: 1.5 }}>
                <Chip label="Skupiny" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.length ? (
              reservations.map((reservation) => (
                <ReservationListItem
                  key={reservation.id}
                  reservation={reservation}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography variant="h6">
                    Žádné rezervace k zobrazení
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
