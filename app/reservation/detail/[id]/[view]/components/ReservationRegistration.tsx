import { getServerSession } from "next-auth";
import ReservationRegistrationToggle from "./ReservationRegistrationToggle";
import { getReservationRegisteredUsers, getReservationRegistration } from "@/lib/api"
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Button, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { smartTime } from "@/app/constants/smartTime";
import TableListPagination from "@/ui-components/TableListPagination";
import UserApproveButton from "./UserApproveButton";
import UserRejectButton from "./UserRejectButton";
import React, { useState } from "react";
import dayjs from "dayjs";

export default async function ReservationRegistration({ id, page = 1 }: { id: any, page: any }) {
  const { user } = await getServerSession(authOptions) as any
  const { data } = await getReservationRegistration({ reservationId: id }) as any
  const { data: registerdUsers, count: registeredUsersCount } = await getReservationRegisteredUsers({ reservationId: id, page })

  console.log(registerdUsers)
  const isAdmin = user.role.id !== 3
  const disabled = !isAdmin || data.status_id === 1
  const on = data.form_id && data.form_public_url
  const conflicts = registerdUsers.some((user: any) => !Boolean(user.verified_registration))

  return (
    <div className="flex flex-col gap-2">
      <ReservationRegistrationToggle reservation={data} disabled={disabled} conflicts={conflicts} />
      <Divider />
      <Typography variant="h5">Registrovaní uživatelé</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
              <TableCell>Jméno</TableCell>
              <TableCell>Registrace provedena</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Adresa</TableCell>
              <TableCell>Datum narození</TableCell>
              <TableCell>Číslo OP</TableCell>
              <TableCell padding="none">
                <TableListPagination count={registeredUsersCount} name={"page"} rpp={10} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registerdUsers.map((user: any, i: any) => (
              <TableRow key={i}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{smartTime(user.timestamp)}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.user_adress}</TableCell>
                <TableCell>{user.user_birth_date && dayjs(user.user_birth_date).format("DD. MM. YYYY")}</TableCell>
                <TableCell>{user.user_ID_code}</TableCell>
                <TableCell>
                  {on && !disabled && !user.verified_registration && <div className="flex gap-3 justify-end">
                    <UserApproveButton userId={user.id} reservationId={id} />
                    <UserRejectButton userId={user.id} reservationId={id} />
                  </div>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Typography className="mt-2">Pokud máte podezření, že některé informace poskytnuté uživateli jsou nesprávné, zamítněte prosím registraci a požádejte uživatele o nové vyplnění.</Typography>
      </TableContainer>
    </div>
  )
}
