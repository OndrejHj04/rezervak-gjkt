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
  TableRow,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Link from "next/link";
import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { getFullName } from "@/app/constants/fullName";
import { userAddGroups, userAddReservations, userDelete } from "@/lib/api";
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

  const setMenuPosition = (e: any) => {
    setAnchorEl(
      anchorEl === null
        ? {
          mouseX: e.clientX + 2,
          mouseY: e.clientY - 6,
        }
        : null
    )
  }

  const handleAddToGroup = (groupId: any) => {
    userAddGroups({ user: user.id, groups: [groupId] }).then(({ success }) => {
      if (success) toast.success("Uživatel úspěšně přidán do skupiny")
      else toast.error("Něco se nepovedlo")
      refresh()
    })
  }

  const handleAddToReservation = (reservationId: any) => {
    userAddReservations({ user: user.id, reservations: [reservationId] }).then(({ success }) => {
      if (success) toast.success("Uživatel úspěšně přidán do rezervace")
      else toast.error("Něco se nepovedlo")
      refresh()
    })
  }

  const handleUserDelete = () => {
    userDelete({ userId: user.id }).then(({ success }) => {
      if (success) toast.success("Uživatel úspěšně odstraněn")
      else toast.error("Něco se nepovedlo")
      refresh()
    })
  }

  return (
    <React.Fragment key={user.id}>
      <TableRow onClick={setMenuPosition} selected={Boolean(anchorEl)}>
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
          <div className="flex items-center gap-2">
            <AvatarWrapper data={user} />
            {getFullName(user)}
          </div>
        </TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.role.name}</TableCell>
        <TableCell>
          {user.organization && user.organization.name}
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
            <MenuItem disabled={group.users.includes(user.id)} key={group.id} onClick={() => handleAddToGroup(group.id)}>Přidat do skupiny {group.name}</MenuItem>
          ))}
          <Divider />
          {avaliableReservations.map((reservation: any) => (
            <MenuItem disabled={reservation.users.includes(user.id)} key={reservation.id} onClick={() => handleAddToReservation(reservation.id)}>Přidat do rezervace {reservation.name}</MenuItem>
          ))}
          {isAdmin && <React.Fragment>
            <Divider />
            <MenuItem onClick={handleUserDelete}>Odstranit uživatele</MenuItem>
          </React.Fragment>}
        </Menu>
      </TableRow>
      {open && (
        <React.Fragment>
          {childrenData && childrenData.length && (
            <TableRow>
              <TableCell colSpan={10}>
                <div className="m-3">
                  <Typography variant="h6">
                    Dětské účty uživatele {user.first_name} {user.last_name}
                  </Typography>
                  <Table size="small">
                    <TableBody>
                      {childrenData.map((child: any) => (
                        <UserListItem
                          key={child.id}
                          user={child}
                          childrenData={null}
                          avaliableGroups={avaliableGroups}
                          avaliableReservations={avaliableReservations}
                          isAdmin={isAdmin}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TableCell>
            </TableRow>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
