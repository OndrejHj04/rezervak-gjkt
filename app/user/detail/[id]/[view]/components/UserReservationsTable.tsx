import { getUserReservations } from "@/lib/api"
import { dayjsExtended } from "@/lib/dayjsExtended"
import AvatarWrapper from "@/ui-components/AvatarWrapper"
import TableListPagination from "@/ui-components/TableListPagination"
import { Icon, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"

export default async function UserReservationsTable({ id, page = 1 }: { id: any, page: any }) {
  const { data, count } = await getUserReservations({ userId: id, page })

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
            <TableCell>Název</TableCell>
            <TableCell>Začátek</TableCell>
            <TableCell>Konec</TableCell>
            <TableCell>Počet účastníků</TableCell>
            <TableCell>Vedoucí</TableCell>
            <TableCell>Status</TableCell>
            <TableCell padding="none">
              <TableListPagination count={count} name="page" rpp={10} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((reservation: any) => (
            <TableRow key={reservation.id}>
              <TableCell>{reservation.name}</TableCell>
              <TableCell>{dayjsExtended(reservation.from_date).format("DD. MMMM YYYY")}</TableCell>
              <TableCell>{dayjsExtended(reservation.to_date).format("DD. MMMM YYYY")}</TableCell>
              <TableCell>{reservation.users_count}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <AvatarWrapper data={{ image: reservation.leader_image }} />
                  {reservation.leader_name}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Icon sx={{ color: reservation.status_color }} className="mr-2">
                    {reservation.status_icon}
                  </Icon>
                  {reservation.status_name}
                </div>
              </TableCell>
              <TableCell align="right">
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
