import { getSendMails } from "@/lib/api"
import TableListPagination from "@/ui-components/TableListPagination"
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import dayjs from "dayjs"
import Link from "next/link"

export default async function MailingSend({ page }: any) {
  const { data, count } = await getSendMails({ page })
  return (
    <Paper>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
              <TableCell>Datum odeslání</TableCell>
              <TableCell>Předmět</TableCell>
              <TableCell>Obsah</TableCell>
              <TableCell padding="none">
                <TableListPagination count={count} name={"page"} rpp={10} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((mail: any) => {
              const truncateRecipients = mail.recipients.split(",").length > 2 ? `${mail.recipients.split(",").slice(0, 2).join(",")}...` : mail.recipients
              const truncateContent = mail.content.length > 100 ? `${mail.content.slice(0, 100)}...` : mail.content
              return (
                <TableRow key={mail.id}>
                  <TableCell className="w-1 whitespace-nowrap">
                    {dayjs(mail.date).format("DD. MM. YYYY HH:mm")}
                  </TableCell>
                  <TableCell className="w-1 whitespace-nowrap">
                    <Typography>
                      {mail.subject}
                    </Typography>
                    <Typography variant="caption" color="gray">
                      {truncateRecipients}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="inherit" className="whitespace-nowrap">
                      {truncateContent}
                    </Typography>
                  </TableCell>
                  <TableCell className="w-1">
                    <Link href={`/mailing/send/detail/${mail.id}`}>
                      <Button variant="text">
                        detail
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>)
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
