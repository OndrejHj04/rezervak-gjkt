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
import SortableCell from "./components/SortableCell";

export default async function ReservationList({
  searchParams,
}: {
  searchParams: any;
}) {
  const { user } = await getServerSession(authOptions) as any
  const { page = 1, status = 0, search = "", sort = "creation_date", direction = "desc" } = searchParams
  const { data, count } = (await getReservationList({
    page,
    status: Number(status),
    search,
    sort: sort,
    direction: direction
  })) as any;
  const isAdmin = user.role.id !== 3

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
            <SortableCell name="name">Název</SortableCell>
            <SortableCell name="creation_date">Datum vytvoření</SortableCell>
            <SortableCell name="from_date">Začátek</SortableCell>
            <SortableCell name="to_date">Konec</SortableCell>
            <SortableCell name="users_count">Počet účastníků</SortableCell>
            <SortableCell name="active_registration">Registrace</SortableCell>
            <SortableCell name="leader_name">Vedoucí</SortableCell>
            <SortableCell name="beds_count" >Lůžka</SortableCell>
            <SortableCell name="status_id">Status</SortableCell>
            <TableCell padding="none" className="w-[150px]">
              <TableListPagination
                count={count}
                name="page"
                rpp={10}
              />
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
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
