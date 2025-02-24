import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import TableListPagination from "@/ui-components/TableListPagination";
import { getReservationList } from "@/lib/api";
import ReservationListItem from "../list/components/ReservationListItem";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function ReservationList({
  searchParams,
}: {
  searchParams: any;
}) {
  const { user } = (await getServerSession(authOptions)) as any;
  const { page = 1, status = 0, search = "", registration = 0 } = searchParams;
  const { data, count } = (await getReservationList({
    page,
    status: Number(status),
    search,
    registration: Number(registration),
  })) as any;
  const isAdmin = user.role.id !== 3;

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
            <TableCell>Název</TableCell>
            <TableCell>Datum vytvoření</TableCell>
            <TableCell>Začátek</TableCell>
            <TableCell>Konec</TableCell>
            <TableCell>Počet účastníků</TableCell>
            <TableCell>Registrace</TableCell>
            <TableCell>Vedoucí</TableCell>
            <TableCell>Lůžka</TableCell>
            <TableCell>Status</TableCell>
            <TableCell padding="none" className="w-[150px]">
              <TableListPagination count={count} name="page" rpp={10} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((reservation: any) => {
            return (
              <ReservationListItem
                searchParams={searchParams}
                key={reservation.id}
                reservation={reservation}
                userId={user.id}
                isAdmin={isAdmin}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
