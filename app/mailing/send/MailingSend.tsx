import { getSendMails } from "@/lib/api"
import TableListPagination from "@/ui-components/TableListPagination"
import { Box, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import dayjs from "dayjs"
import Link from "next/link"

export default async function MailingSend() {
  const { data, count } = await getSendMails({})
  return (

    <div className="flex flex-col w-full gap-2">
      <Paper>
        <Box sx={{ overflow: "auto" }}>
          <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
            <Table size="small">
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
            <TableListPagination
              count={count || 0}
              name="page"
              rpp={10}
            />
          </Box>
        </Box>
      </Paper>
    </div >

  )
}
