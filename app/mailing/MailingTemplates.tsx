import {
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Link from "next/link";

export default function MailingTemplates({ templates }: { templates: any }) {
  return (
    <Paper className="w-full p-2">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ padding: 1.5 }} />
            <TableCell sx={{ padding: 1.5 }}>
              <Chip label={"Název"} />
            </TableCell>
            <TableCell sx={{ padding: 1.5 }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {templates.map((temp: any) => (
            <TableRow key={temp.id}>
              <TableCell sx={{ padding: 1.5 }} />
              <TableCell sx={{ padding: 1.5 }}>{temp.title}</TableCell>
              <TableCell sx={{ padding: 1.5 }}>
                <Link href={`/mailing/templates/detail/${temp.id}`}>
                  <Button>detail</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
