import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import TableListPagination from "@/ui-components/TableListPagination";
import { rolesConfig } from "@/lib/rolesConfig";

import { getReservationList } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import ReservationListItem from "../list/components/ReservationListItem";
import React from "react";

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
    <React.Fragment>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
              <TableCell>Název</TableCell>
              <TableCell>Datum vytvoření</TableCell>
              <TableCell>Začátek</TableCell>
              <TableCell>Konec</TableCell>
              <TableCell>Počet účastníků</TableCell>
              <TableCell>Přihlašování</TableCell>
              <TableCell>Vedoucí</TableCell>
              <TableCell>Lůžka</TableCell>
              <TableCell>Status</TableCell>
              <TableCell padding="none">
                <TableListPagination
                  count={reservations.count || 0}
                  name="page"
                  rpp={10}
                />
              </TableCell>
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
      </TableContainer>
    </React.Fragment>
  )
}
