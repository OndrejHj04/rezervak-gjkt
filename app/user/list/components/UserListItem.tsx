"use client";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Link from "next/link";
import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { userAddGroups, userAddReservations, setUserAsOutside, deleteUserWithChildren } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function UserListItem({
  user,
  childrenData,
  avaliableGroups,
  avaliableReservations,
  isAdmin
}: {
  user: any;
  childrenData: any;
  avaliableGroups: any
  avaliableReservations: any
  isAdmin: any
}) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<any>(null)
  const { refresh } = useRouter()

  const handleOpenSubRow = (e: any) => {
    e.stopPropagation()
    setOpen(o => !o)
  }

  const setMenuPosition = (e: any, id: any, role: any) => {
    setAnchorEl(
      anchorEl === null
        ? {
          mouseX: e.clientX + 2,
          mouseY: e.clientY - 6,
          id: id,
          role: role
        }
        : null
    )
  }

  const handleAddToGroup = (groupId: any) => {
    userAddGroups({ user: anchorEl.id, group: groupId }).then(({ success }) => {
      if (success) toast.success("Uživatel úspěšně přidán do skupiny")
      else toast.error("Něco se nepovedlo")
      refresh()
    })
  }

  const handleAddToReservation = (reservationId: any) => {
    userAddReservations({ user: anchorEl.id, reservation: reservationId }).then(({ success }) => {
      if (success) toast.success("Uživatel úspěšně přidán do rezervace")
      else toast.error("Něco se nepovedlo")
      refresh()
    })
  }

  const handleUserSetPublic = () => {
    setUserAsOutside({ userId: anchorEl.id }).then(({ success }) => {
      if (success) toast.success("Uživatel nastaven jako veřejnost")
      else toast.error("Něco se nepovedlo")
      refresh()
    })
  }

  const handleDeleteUser = () => {
    deleteUserWithChildren({ userId: anchorEl.id }).then(({ success }) => {
      if (success) toast.success("Uživatel úspěšně odstraněn")
      else toast.error("Něco se nepovedlo")
      refresh()
    })
  }

  return (
    <React.Fragment key={user.id}>
      <TableRow onClick={(e) => setMenuPosition(e, user.id, user.role_id)} selected={Boolean(anchorEl) && anchorEl.id === user.id}>
        {childrenData && (
          <TableCell>
            {!!childrenData.length && (
              <IconButton size="small" onClick={handleOpenSubRow}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            )}
          </TableCell>
        )}
        <TableCell>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <AvatarWrapper data={user} />
            {user.name}
          </div>
        </TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.role_name}</TableCell>
        <TableCell>
          {user.organization_name}
        </TableCell>
        <TableCell>
          {user.verified ? (
            <CheckCircleIcon color="success" sx={{ width: 32, height: 32 }} />
          ) : (
            <CancelIcon color="error" sx={{ width: 32, height: 32 }} />
          )}
        </TableCell>
        <TableCell align="right" className="min-w-[150px]">
          <Link href={`/user/detail/${user.id}/info`} onClick={e => e.stopPropagation()}>
            <Button>Detail</Button>
          </Link>
        </TableCell>
        <Menu open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorReference="anchorPosition"
          anchorPosition={anchorEl !== null
            ? { top: anchorEl.mouseY, left: anchorEl.mouseX }
            : undefined}
        >
          {avaliableGroups.map((group: any) => (
            <MenuItem disabled={group.users.includes(anchorEl?.id)} key={group.id} onClick={() => handleAddToGroup(group.id)}>Přidat do skupiny {group.name}</MenuItem>
          ))}
          {!!avaliableReservations.length && !!avaliableGroups.length && <Divider className="!my-0" />}
          {avaliableReservations.map((reservation: any) => (
            <MenuItem disabled={reservation.users.includes(anchorEl?.id)} key={reservation.id} onClick={() => handleAddToReservation(reservation.id)}>Přidat do rezervace {reservation.name}</MenuItem>
          ))}
          {!!avaliableGroups.length && !!isAdmin && <Divider className="!my-0" />}
          {isAdmin && (
            anchorEl?.role !== 4 ? <MenuItem onClick={handleUserSetPublic}>Nastavit jako veřejnost</MenuItem> :
              <MenuItem onClick={handleDeleteUser}>Smazat účet</MenuItem>)
          }
          {!avaliableGroups.length && !avaliableReservations.length && !isAdmin && (
            <MenuItem disabled>Žádné možnosti</MenuItem>
          )}
        </Menu>
      </TableRow>
      {open && (
        <React.Fragment>
          {!!childrenData.length && (
            <TableRow>
              <TableCell colSpan={10}>
                <div className="m-3">
                  <Typography variant="h6">
                    Rodina uživatele {user.name}
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
                        <TableCell>Jméno</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Organizace</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {childrenData.map((child: any) => (
                        <TableRow key={child.id} onClick={(e) => setMenuPosition(e, child.id, child.role_id)} selected={Boolean(anchorEl) && anchorEl.id === child.id}>
                          <TableCell>{child.name}</TableCell>
                          <TableCell>{child.role}</TableCell>
                          <TableCell>{child.organization}</TableCell>
                          <TableCell align="right">
                            <Button size="small" variant="text" component={Link} href={`/user/detail/${child.id}/info`} onClick={(e) => e.stopPropagation()}>detail</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TableCell>
            </TableRow>
          )}
        </React.Fragment>
      )
      }
    </React.Fragment >
  );
}
