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
import { Reservation } from "@/types";
import TrashBin from "./components/TrashBin";
import StatusSelect from "./components/StatusSelect";
import SearchBar from "./components/SearchBar";
import ReservationsPagination from "./components/ReseravtionsPagination";
import dynamic from "next/dynamic";
import ReservationsExport from "./components/ReservationsExport";

const getReservations = async (page: any, status: any, search: any) => {
  try {
    const req = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/reservations/list?page=${page}&status=${status}${
        search ? `&search=${search}` : ""
      }`,
      { cache: "no-cache" }
    );
    const data = await req.json();
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

const ReservationListItem = dynamic(
  () => import("./components/ReservationListItem")
);

export default async function ReservationsListPage({
  searchParams,
}: {
  searchParams: any;
}) {
  const page = searchParams["page"] || 1;
  const status = searchParams["status"] || 0;
  const search = "";

  const data = (await getReservations(page, status, search)) as any;
  const reservations = (await data.data) as Reservation[];
  const statuses = await getStatuses();

  const body = reservations.length ? (
    reservations.map((reservation) => (
      <ReservationListItem key={reservation.id} reservation={reservation} />
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={9}>
        <Typography variant="h6">Žádné rezervace k zobrazení</Typography>
      </TableCell>
    </TableRow>
  );
  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex justify-between">
        <TrashBin />
        <SearchBar />
        <div className="flex gap-2 items-center">
          <StatusSelect statuses={statuses} />
          <ReservationsExport reservations={reservations.length} />
        </div>
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
          <TableBody className="overflow-scroll">{body}</TableBody>
        </Table>
        <ReservationsPagination count={data.count} />
      </Paper>
    </div>
  );
}
