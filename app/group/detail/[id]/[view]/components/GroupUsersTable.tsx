import { getGroupUsers } from "@/lib/api"
import AvatarWrapper from "@/ui-components/AvatarWrapper"
import TableListPagination from "@/ui-components/TableListPagination"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"

export default async function GroupUsersTable({ id, page = 1 }: { id: any, page: any }) {
  const { data, count } = await getGroupUsers({ groupId: id, page: page })

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
              <TableListPagination count={count} name={"page"} rpp={10} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((user: any) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <AvatarWrapper data={{ image: user.image }} />
                  {user.name}
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.organization}</TableCell>
              <TableCell>{user.verified}</TableCell>
              <TableCell />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
