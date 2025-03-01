import {
  Button,
  ButtonBase,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { getReservationDataOverview } from "@/lib/api";
import DataOverviewTableRow from "./DataOverviewTableRow";

export default async function DataOverview({ searchParams: { fuse } }: any) {
  const { data } = await getReservationDataOverview({});
  const isFusing = fuse === "true"

  return (
    <>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
              <TableCell>
                <ButtonBase className="font-semibold text-lg">
                  Rozbalit detail
                </ButtonBase>
              </TableCell>
              <TableCell>Uživatel</TableCell>
              <TableCell>Počet nocí</TableCell>
              <TableCell>Fúze řádků</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((user) => (
              <DataOverviewTableRow key={user.id} user={user} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
