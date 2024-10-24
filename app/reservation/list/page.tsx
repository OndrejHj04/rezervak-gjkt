import {
  Box,
  Chip,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
} from "@mui/material";
import TrashBin from "./components/TrashBin";
import TableListPagination from "@/ui-components/TableListPagination";
import { rolesConfig } from "@/lib/rolesConfig";

import ReservationTableSort from "./components/Sort";
import ReservationFilters from "./components/ReservationFilters";
import { getReservationList } from "@/lib/api";
import ReservationListItem from "./components/ReservationListItem";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function ReservationList({
  searchParams,
}: {
  searchParams: any;
}) {
  const { user } = (await getServerSession(authOptions)) as any;

  const page = searchParams["page"] || 1;
  const status = searchParams["status"] || 0;
  const search = searchParams["search"] || "";
  const type = searchParams["type"] || "all";
  const col = searchParams["col"];
  const dir = searchParams["dir"];
  const reservations = (await getReservationList({
    page,
    type,
    status: Number(status),
    search,
    col,
    dir,
  })) as any;

  return (
    <div className="flex flex-col w-full gap-2">
      <ReservationFilters userRole={user.role.id} />
      <Paper>
        <Box sx={{ overflow: "auto" }}>
          <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ padding: 1.5 }}>
                    <Chip label="Název" />
                  </TableCell>
                  <ReservationTableSort />
                  <TableCell sx={{ padding: 1.5 }}>
                    <Chip label="Počet účastníků" />
                  </TableCell>
                  <TableCell sx={{ padding: 1.5 }}>
                    <Chip label="Otevřené přihlašování" />
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
              <TableBody className="overflow-scroll [&_.Mui-selected]:cursor-context-menu">
                {reservations.data.map((reservation: any) => (
                  <ReservationListItem
                    searchParams={searchParams}
                    userId={user.id}
                    userRole={user.role.id}
                    key={reservation.id}
                    reservation={reservation}
                  />
                ))}
              </TableBody>
            </Table>
            <TableListPagination
              count={reservations.count || 0}
              name="page"
              rpp={10}
            />
          </Box>
        </Box>
      </Paper>
    </div >
  )
}
