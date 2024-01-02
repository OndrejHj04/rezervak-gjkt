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
import dynamic from "next/dynamic";
import SearchBar from "@/ui-components/SearchBar";
import TableListPagination from "@/ui-components/TableListPagination";
import ExportButton from "@/ui-components/ExportButton";
import { rolesConfig } from "@/rolesConfig";

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

export default async function ReservationList({
  searchParams,
  userRole,
  userId,
}: {
  searchParams: any;
  userRole: any;
  userId: any;
}) {
  const page = searchParams["page"] || 1;
  const status = searchParams["status"] || 0;
  const search = searchParams["search"] || 0;
  const reservations = (await getReservations(page, status, search)) as any;
  const statuses = await getStatuses();

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex justify-between">
        {rolesConfig.reservations.table.topbar.search.includes(userRole) && (
          <SearchBar label={"rezervace"} />
        )}
        {rolesConfig.reservations.table.topbar.export.includes(userRole) && (
          <StatusSelect statuses={statuses} />
        )}
        {rolesConfig.reservations.table.topbar.export.includes(userRole) && (
          <ExportButton prop={"reservations"} />
        )}
      </div>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              {rolesConfig.reservations.table.delete.includes(userRole) && (
                <TableCell>
                  <TrashBin />
                </TableCell>
              )}

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
                userId={userId}
                userRole={userRole}
                key={reservation.id}
                reservation={reservation}
              />
            ))}
          </TableBody>
        </Table>
        <TableListPagination count={reservations.count} />
      </Paper>
    </div>
  );
}
