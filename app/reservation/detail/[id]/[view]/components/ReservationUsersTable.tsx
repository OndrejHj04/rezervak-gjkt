import { getReservationUsers } from "@/lib/api";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import TableListPagination from "@/ui-components/TableListPagination";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import ReservationUsersRemoveButton from "./ReservationUsersRemoveButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function ReservationUsersTable({ id, page = 1 }: { id: any, page: any }) {
  const { data, count } = await getReservationUsers({ reservationId: id, page })
  const { user } = await getServerSession(authOptions) as any
  const isAdmin = user.role.id !== 3

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
            <TableCell>Jméno</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Organizace</TableCell>
            <TableCell>Ověření</TableCell>
            <TableCell padding="none">
              <TableListPagination count={count} name="page" rpp={10} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((user: any) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex gap-2 items-center">
                  <AvatarWrapper data={{ image: user.image }} />
                  {user.name}
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role_name}</TableCell>
              <TableCell>{user.organization_name}</TableCell>
              <TableCell>{user.verified}</TableCell>
              <TableCell align="right">
                {isAdmin && <ReservationUsersRemoveButton reservationId={id} userId={user.id} />}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
