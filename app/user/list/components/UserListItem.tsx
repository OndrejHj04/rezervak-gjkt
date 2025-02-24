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
  Tooltip,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Link from "next/link";
import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  userAddGroups,
  userAddReservations,
  setUserAsOutside,
  deleteUserWithChildren,
  resendRegistraionMail,
} from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { store } from "@/store/store";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";

export default function UserListItem({
  user,
  childrenData,
  avaliableGroups,
  avaliableReservations,
  isAdmin,
}: {
  user: any;
  childrenData: any;
  avaliableGroups: any;
  avaliableReservations: any;
  isAdmin: any;
}) {
  const [open, setOpen] = useState(false);
  const { refresh } = useRouter();
  const { selectedUser, setSelectedUser } = store();

  const handleOpenSubRow = (e: any) => {
    e.stopPropagation();
    setOpen((o) => !o);
  };

  const isSelected = selectedUser && selectedUser.id === user.id;
  const isChildrenSelected =
    user.children.length &&
    user.children.some((u: any) => u.id === selectedUser?.id);

  const setMenuPosition = (e: any, userId: any, userRole: any) => {
    if (isSelected) {
      setSelectedUser(null);
    } else {
      setSelectedUser({
        mouseX: e.clientX + 2,
        mouseY: e.clientY - 6,
        id: userId,
        role: userRole,
      });
    }
  };

  const handleAddToGroup = (groupId: any) => {
    userAddGroups({ user: selectedUser.id, group: groupId }).then(
      ({ success }) => {
        if (success) toast.success("Uživatel úspěšně přidán do skupiny");
        else toast.error("Něco se nepovedlo");
        refresh();
      }
    );
    setSelectedUser(null);
  };

  const handleAddToReservation = (reservationId: any) => {
    userAddReservations({
      user: selectedUser.id,
      reservation: reservationId,
    }).then(({ success }) => {
      if (success) toast.success("Uživatel úspěšně přidán do rezervace");
      else toast.error("Něco se nepovedlo");
      refresh();
    });
    setSelectedUser(null);
  };

  const handleUserSetPublic = () => {
    setUserAsOutside({ userId: selectedUser.id }).then(({ success }) => {
      if (success) toast.success("Uživatel nastaven jako veřejnost");
      else toast.error("Něco se nepovedlo");
      refresh();
    });
    setSelectedUser(null);
  };

  const handleDeleteUser = (e: any) => {
    e.stopPropagation();
    deleteUserWithChildren({
      userId: selectedUser.id,
      isParent: selectedUser.id === user.id,
    }).then(({ success }) => {
      if (success) toast.success("Uživatel nastaven jako veřejnost");
      else toast.error("Něco se nepovedlo");
      refresh();
    });
    setSelectedUser(null);
  };

  const handleCloseMenu = (e: any) => {
    e.stopPropagation();
    setSelectedUser(null);
  };

  const handleResendEmail = (e: any, user: any) => {
    e.stopPropagation();
    resendRegistraionMail({
      user,
    }).then(({ success }) => {
      if (success) toast.success("Registrační email byl znovu odeslán");
      else toast.error("Něco se nepovedlo");
      refresh();
    });
  };

  return (
    <React.Fragment key={user.id}>
      <TableRow
        onClick={(e) => setMenuPosition(e, user.id, user.role_id)}
        selected={isSelected}
      >
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
        {isAdmin && <TableCell>{user.role_name}</TableCell>}
        {isAdmin && <TableCell>{user.organization_name}</TableCell>}
        {isAdmin && (
          <TableCell>
            <div className="flex items-center">
              {user.verified ? (
                <CheckCircleIcon color="success" />
              ) : (
                <>
                  <CancelIcon color="error" />
                  <Tooltip title="Znovu odeslat uživateli registrační email">
                    <IconButton onClick={(e) => handleResendEmail(e, user)}>
                      <ForwardToInboxIcon />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </div>
          </TableCell>
        )}

        <TableCell align="right" className="min-w-[150px]">
          {!!user.detail && (
            <Link
              href={`/user/detail/${user.id}/info`}
              onClick={(e) => e.stopPropagation()}
            >
              <Button>Detail</Button>
            </Link>
          )}
        </TableCell>
        <Menu
          open={Boolean(isSelected) || Boolean(isChildrenSelected)}
          onClose={handleCloseMenu}
          anchorReference="anchorPosition"
          anchorPosition={
            selectedUser !== null
              ? { top: selectedUser.mouseY, left: selectedUser.mouseX }
              : undefined
          }
        >
          {avaliableGroups.map((group: any) => (
            <MenuItem
              disabled={group.users.includes(selectedUser?.id)}
              key={group.id}
              onClick={() => handleAddToGroup(group.id)}
            >
              Přidat do skupiny {group.name}
            </MenuItem>
          ))}
          {!!avaliableReservations.length && !!avaliableGroups.length && (
            <Divider className="!my-0" />
          )}
          {avaliableReservations.map((reservation: any) => (
            <MenuItem
              disabled={reservation.users.includes(selectedUser?.id)}
              key={reservation.id}
              onClick={() => handleAddToReservation(reservation.id)}
            >
              Přidat do rezervace {reservation.name}
            </MenuItem>
          ))}
          {!!avaliableGroups.length && !!isAdmin && (
            <Divider className="!my-0" />
          )}
          {isAdmin &&
            (selectedUser?.role !== 4 ? (
              <MenuItem onClick={handleUserSetPublic}>
                Nastavit jako veřejnost
              </MenuItem>
            ) : (
              <MenuItem onClick={handleDeleteUser}>Smazat účet</MenuItem>
            ))}
          {!avaliableGroups.length &&
            !avaliableReservations.length &&
            !isAdmin && <MenuItem disabled>Žádné možnosti</MenuItem>}
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
                        <TableRow
                          key={child.id}
                          onClick={(e) =>
                            setMenuPosition(e, child.id, child.role_id)
                          }
                          selected={
                            isChildrenSelected && selectedUser?.id === child.id
                          }
                        >
                          <TableCell>{child.name}</TableCell>
                          <TableCell>{child.role}</TableCell>
                          <TableCell>{child.organization}</TableCell>
                          <TableCell align="right">
                            <Button
                              size="small"
                              variant="text"
                              component={Link}
                              href={`/user/detail/${child.id}/info`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              detail
                            </Button>
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
      )}
    </React.Fragment>
  );
}
