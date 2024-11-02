import { getReservationsArchive } from "@/lib/api";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import TableListPagination from "@/ui-components/TableListPagination";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import dayjs from "dayjs";

export default async function ArchivePage({ searchParams }: { searchParams: any }) {
  const { page = 1 } = searchParams
  const { data, count } = await getReservationsArchive({ page })

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
            <TableCell>Vedoucí</TableCell>
            <TableCell padding="none">
              <TableListPagination
                count={count}
                name="page"
                rpp={10}
              />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((reservation: any) => (
            <TableRow key={reservation.id}>
              <TableCell>{reservation.name}</TableCell>
              <TableCell>{dayjs(reservation.creation_date).format("DD. MM. YYYY")}</TableCell>
              <TableCell>{dayjs(reservation.from_date).format("DD. MM. YYYY")}</TableCell>
              <TableCell>{dayjs(reservation.to_date).format("DD. MM. YYYY")}</TableCell>
              <TableCell>{reservation.users_count}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <AvatarWrapper data={{ image: reservation.leader_image }} />
                  {reservation.leader_name}
                </div>
              </TableCell>
              <TableCell align="right">
                <Button href={`/reservation/detail/${reservation.id}/info`}>Detail</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
