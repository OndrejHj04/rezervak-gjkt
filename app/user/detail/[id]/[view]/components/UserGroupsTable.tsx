import { getUserGroups } from "@/lib/api";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import TableListPagination from "@/ui-components/TableListPagination";
import { Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

export default async function UserGroupsTable({ id, page = 1 }: { id: any, page: any }) {
  const { data, count } = await getUserGroups({ userId: id, page: page })

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
            <TableCell>Název</TableCell>
            <TableCell>Popis</TableCell>
            <TableCell>Majitel</TableCell>
            <TableCell padding="none">
              <TableListPagination count={count} name="page" rpp={10} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((group: any) => (
            <TableRow key={group.id}>
              <TableCell>{group.name}</TableCell>
              <TableCell>{group.description}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <AvatarWrapper data={{ image: group.owner_image }} />
                  {group.owner_name}
                </div>
              </TableCell>
              <TableCell />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )

}
