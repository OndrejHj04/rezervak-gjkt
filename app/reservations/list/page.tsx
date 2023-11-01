import {
  Chip,
  InputAdornment,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import CheckboxComponent from "./components/CheckboxComponent";
import UserListItem from "@/app/user/list/UserListItem";
import { Reservation } from "@/types";
import ReservationListItem from "./components/ReservationListItem";
import TrashBin from "./components/TrashBin";
import StatusSelect from "./components/StatusSelect";
import SearchBar from "./components/SearchBar";

const getReservations = async () => {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/reservations/list`,
    { cache: "no-cache" }
  );
  const { data } = await req.json();
  return data as Reservation[];
};

const getStatuses = async () => {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/reservations/status`
  );
  const { data } = await req.json();
  return data;
};

export default async function ReservationsListPage() {
  const reservations = await getReservations();
  const statuses = await getStatuses();

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex justify-between">
        <TrashBin />
        <SearchBar />
        <StatusSelect statuses={statuses} />
      </div>
      <Paper className="w-full p-2">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <CheckboxComponent reservations={reservations} />
              </TableCell>
              <TableCell sx={{ padding: 1.5 }}>
                <Chip label="Název" />
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
              <TableCell sx={{ padding: 1.5 }}>
                <Chip label="Stav" />
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
                <TableCell colSpan={9}>
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
