import { getUserList, getUsersAvaliableGroups, getUsersAvaliableReservations } from "@/lib/api";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import UserListItem from "./components/UserListItem";
import TableListPagination from "@/ui-components/TableListPagination";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function UserListConfig({
  searchParams: { users, search, organization, role },
}: {
  searchParams: { users: any, search: any, organization: any, role: any }
}) {

  const { user: currentUser } = await getServerSession(authOptions) as any

  const { data, count } = await getUserList({
    page: users || 1,
    search: search || "",
    role: Number(role) || 0,
    organization: Number(organization) || 0,
    withChildrenCollapsed: true,
  });

  const { groups: avaliableGroups } = await getUsersAvaliableGroups(currentUser.id)
  const { reservations: avaliableReservations } = await getUsersAvaliableReservations(currentUser.id)

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
            <TableCell />
            <TableCell />
            <TableCell>Jméno</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Organizace</TableCell>
            <TableCell>Ověření</TableCell>
            <TableCell padding="none">
              <TableListPagination count={count} name={"users"} rpp={10} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((user: any) => (
            <UserListItem
              key={user.id}
              user={user}
              childrenData={user.children}
              avaliableGroups={avaliableGroups}
              avaliableReservations={avaliableReservations}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
