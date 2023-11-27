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
import ReservationsPagination from "./components/ReseravtionsPagination";
import dynamic from "next/dynamic";
import ReservationsExport from "./components/ReservationsExport";
import SearchBar from "@/ui-components/SearchBar";

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
  const search = searchParams["search"] || 0;

  const reservations = (await getReservations(page, status, search)) as any;

  const statuses = await getStatuses();
  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex justify-between">
        <TrashBin />
        <SearchBar label={"rezervace"} />
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
                <CheckboxComponent reservations={reservations.data} />
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
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody className="overflow-scroll">
            {reservations.data.map((reservation: any) => (
              <ReservationListItem
                key={reservation.id}
                reservation={reservation}
              />
            ))}
          </TableBody>
        </Table>
        <ReservationsPagination count={reservations.count} />
      </Paper>
    </div>
  );
}
