import { getServerSession } from "next-auth";
import ReservationRegistrationToggle from "./ReservationRegistrationToggle";
import { getReservationRegisteredUsers, getReservationRegistration } from "@/lib/api"
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import { smartTime } from "@/app/constants/smartTime";
import TableListPagination from "@/ui-components/TableListPagination";

export default async function ReservationRegistration({ id, page = 1 }: { id: any, page: any }) {
  const { user } = await getServerSession(authOptions) as any
  const { data } = await getReservationRegistration({ reservationId: id }) as any
  const { data: registerdUsers, count: registeredUsersCount } = await getReservationRegisteredUsers({ reservationId: id, page })

  const isAdmin = user.role.id !== 3

  return (
    <div className="flex flex-col gap-2">
      <ReservationRegistrationToggle reservation={data} disabled={!isAdmin} />
      <Divider />
      <Typography variant="h5">Registrovaní uživatelé</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
              <TableCell>Jméno</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Datum registrace</TableCell>
              <TableCell>
                <TableListPagination count={registeredUsersCount} name={"page"} rpp={10} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registerdUsers.map((user: any, i: any) => (
              <TableRow key={i}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{smartTime(user.timestamp)}</TableCell>
                <TableCell />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
