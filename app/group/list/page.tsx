import TableListPagination from "@/ui-components/TableListPagination";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { getGroupList } from "@/lib/api";
import GroupListItem from "./GroupListItem";

export default async function GroupList({
  searchParams: { groups, search }
}: {
  searchParams: any;
}) {
  const { data, count } = await getGroupList({ page: groups || 1, search: search || "" })

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
            <TableCell>Název</TableCell>
            <TableCell>Popis</TableCell>
            <TableCell>Vlastník</TableCell>
            <TableCell className="whitespace-nowrap">Počet členů</TableCell>
            <TableCell padding="none">
              <TableListPagination count={count} name={"groups"} rpp={10} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((group: any) => (
            <GroupListItem key={group.id} group={group} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
