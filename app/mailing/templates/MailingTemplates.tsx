import { malingTemplatesList } from "@/lib/api";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Link from "next/link";

export default async function MailingTemplates() {
  const templates = await malingTemplatesList()

  return (
    <Paper>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
              <TableCell>Název</TableCell>
              <TableCell>Předmět</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {templates.map((temp: any) => (
              <TableRow key={temp.id}>
                <TableCell>{temp.name}</TableCell>
                <TableCell>{temp.title}</TableCell>
                <TableCell align="right">
                  <Button component={Link} href={`/mailing/templates/detail/${temp.id}`}>Detail</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
