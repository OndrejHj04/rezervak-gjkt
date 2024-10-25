"use client";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Button,
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
import { store } from "@/store/store";
import { usersDelete } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function UserListItem({
  user,
  userRole,
  userId,
  childrenData,
}: {
  user: any;
  userRole: any;
  userId: any;
  childrenData: any;
}) {

  const [open, setOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<any>(null)
  const { selectedUsers, setSelectedUsers } = store()
  const { refresh } = useRouter()

  const handleDeleteUsers = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    usersDelete({ users: selectedUsers }).then(({ success }) => {
      if (success) toast.success("Rezervace úspěšně odstraněny");
      else toast.error("Něco se pokazilo");
    })
    refresh()
    setSelectedUsers([])
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu(
      contextMenu === null && selectedUsers.includes(user.id)
        ? {
          mouseX: e.clientX + 2,
          mouseY: e.clientY - 6,
        }
        : null,
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  }

  const handleSelectUser = () => {
    if (selectedUsers.includes(user.id)) {
      setSelectedUsers(selectedUsers.filter((res: any) => res !== user.id))
    } else {
      setSelectedUsers([...selectedUsers, user.id])
    }
  }

  return (
    <React.Fragment key={user.id}>
      <TableRow onContextMenu={handleContextMenu} selected={selectedUsers.includes(user.id)} onClick={handleSelectUser}>
        {childrenData && (
          <TableCell>
            {!!childrenData.length && (
              <IconButton size="small" onClick={() => setOpen((o) => !o)}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            )}
          </TableCell>
        )}
        <TableCell>
          <AvatarWrapper data={user} />
        </TableCell>
        <TableCell>{getFullName(user)}</TableCell>
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
          <Link href={`/user/detail/${user.id}`}>
            <Button>Detail</Button>
          </Link>
        </TableCell>
        <Menu open={Boolean(contextMenu)}
          onClose={handleClose}
          className="[&_.MuiList-root]:!p-0"
          anchorReference="anchorPosition"
          anchorPosition={contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined}
        >
          <MenuItem onClick={handleDeleteUsers}>Odstranit vybrané</MenuItem>
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
                          userId={userId}
                          userRole={userRole}
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
