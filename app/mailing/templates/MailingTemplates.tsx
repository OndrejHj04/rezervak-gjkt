import { malingTemplatesList } from "@/lib/api";
import {
  Box,
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

export default async function MailingTemplates() {
  const templates = await malingTemplatesList()

  return (
    <Paper className="w-full p-2">
      <Box sx={{ overflow: "auto" }}>
        <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ padding: 1.5 }}>
                  <Chip label={"Název"} />
                </TableCell>
                <TableCell sx={{ padding: 1.5 }}>
                  <Chip label={"Předmět"} />
                </TableCell>
                <TableCell sx={{ padding: 1.5 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.map((temp: any) => (
                <TableRow key={temp.id}>
                  <TableCell sx={{ padding: 1.5 }}>{temp.name}</TableCell>
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
        </Box>
      </Box>
    </Paper>
  );
}
