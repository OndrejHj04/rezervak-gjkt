import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { getReservationDataOverview } from "@/lib/api";
import DataOverviewTableRow from "./DataOverviewTableRow";

export default async function DataOverview() {
  const { data } = await getReservationDataOverview({});

  return (
    <>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
              <TableCell>Rozbalit detail</TableCell>
              <TableCell>Uživatel</TableCell>
              <TableCell>Počet nocí</TableCell>
              <TableCell>Fúze řádků</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((user: any) => (
              <DataOverviewTableRow key={user.id} user={user} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
