import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { getReservationDataOverview } from "@/lib/api";
import DataOverviewTable from "./DataOverviewTable";

export default async function DataOverview({
  searchParams: { from_date, to_date, fuse },
}: any) {
  const { data } = await getReservationDataOverview({ from_date, to_date });
  return (
    <>
      <TableContainer className="max-h-full">
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
            <DataOverviewTable data={data} fuse={fuse} />
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
