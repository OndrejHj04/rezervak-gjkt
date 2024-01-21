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
import ExpiredReservations from "./components/ExpiredReservations";

import ReservationTableSort from "./components/Sort";
import dayjs from "dayjs";
import fetcher from "@/lib/fetcher";
const getReservations = async (
  page: any,
  status: any,
  search: any,
  type: any,
  column: any,
  dir: any
) => {
  try {
    const data = await fetcher(
      `/api/reservations/list?page=${page}&type=${type}&status=${status}${
        search ? `&search=${search}` : ""
      }${column ? `&col=${column}` : ""}${dir ? `&dir=${dir}` : ""}`
    );
    return data;
  } catch (e) {
    return [];
  }
};

const getStatuses = async () => {
  try {
    const { data } = await fetcher(`/api/reservations/status?type=all`);
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
  const type = searchParams["type"] || "all";
  const column = searchParams["col"];
  const dir = searchParams["dir"];
  const reservations = (await getReservations(
    page,
    status,
    search,
    type,
    column,
    dir
  )) as any;
  const statuses = await getStatuses();

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex gap-3 justify-end">
        {rolesConfig.reservations.modules.reservationsTable.config.topbar.search.includes(
          userRole
        ) && <SearchBar label={"rezervace"} />}
        {rolesConfig.reservations.modules.reservationsTable.config.topbar.filter.includes(
          userRole
        ) && (
          <>
            <ExpiredReservations />
            <StatusSelect statuses={statuses} />
          </>
        )}
        {rolesConfig.reservations.modules.reservationsTable.config.topbar.export.includes(
          userRole
        ) && <ExportButton prop={"reservations"} translate={"rezervace"} />}
      </div>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              {rolesConfig.reservations.modules.reservationsTable.config.delete.includes(
                userRole
              ) && (
                <TableCell>
                  <TrashBin />
                </TableCell>
              )}

              <TableCell sx={{ padding: 1.5 }}>
                <Chip label="Název" />
              </TableCell>
              <ReservationTableSort />
              <TableCell sx={{ padding: 1.5 }}>
                <Chip label="Počet účastníků" />
              </TableCell>
              <TableCell sx={{ padding: 1.5 }}>
                <Chip label="Vedoucí" />
              </TableCell>
              <TableCell sx={{ padding: 1.5 }}>
                <Chip label="Pokoje" />
              </TableCell>
              <TableCell sx={{ padding: 1.5 }}>
                <Chip label="Skupiny" />
              </TableCell>
              <TableCell sx={{ padding: 1.5 }}>
                <Chip label="Stav" />
              </TableCell>
              <TableCell sx={{ padding: 1.5 }}>
                <Chip label="Datum vytvoření" />
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
