import {
  Chip,
  InputAdornment,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
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
import ReservationsPagination from "./components/ReseravtionsPagination";

const getReservations = async () => {
  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reservations/list`,
      { cache: "no-cache" }
    );
    const { data } = await req.json();
    return data as Reservation[];
  } catch (e) {
    return [];
  }
};

const getStatuses = async () => {
  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reservations/status`
    );
    const { data } = await req.json();
    return data;
  } catch (e) {
    return [];
  }
};

export default async function ReservationsListPage({
  searchParams,
}: {
  searchParams: any;
}) {
  const reservations = await getReservations();
  const statuses = await getStatuses();

  const page = searchParams["page"] || 1;
  const perPage = searchParams["per_page"] || 10;

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex justify-between">
        <TrashBin />
        <SearchBar />
        <StatusSelect statuses={statuses} />
      </div>
      <Paper>
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
          <TableBody className="overflow-scroll">
            {reservations.length ? (
              reservations
                .slice(page * 10 - 10, page * 10)
                .map((reservation) => (
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
        <ReservationsPagination reservations={reservations} />
      </Paper>
    </div>
  );
}
