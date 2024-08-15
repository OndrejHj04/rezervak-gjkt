"use client";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { User } from "next-auth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import dayjs from "dayjs";
import HotelIcon from "@mui/icons-material/Hotel";
import Link from "next/link";
import TableListCheckbox from "@/ui-components/TableListCheckbox";
import { rolesConfig } from "@/lib/rolesConfig";
import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { isNull } from "lodash";
import UserListHeader from "../UserListHeader";

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
  const cells = rolesConfig.users.modules.userTable.columns[
    userRole as never
  ] as any;

  const [open, setOpen] = useState(false);

  return (
    <React.Fragment key={user.id}>
      <TableRow>
        {childrenData && (
          <TableCell>
            {!!childrenData.length && (
              <IconButton size="small" onClick={() => setOpen((o) => !o)}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            )}
          </TableCell>
        )}
        {rolesConfig.users.modules.userTable.config.delete.includes(userRole) &&
        user.id === userId ? (
          <TableCell>
            <Checkbox disabled />
          </TableCell>
        ) : (
          <TableListCheckbox prop="users" id={user.id} />
        )}

        <TableCell>
          <AvatarWrapper data={user} />
        </TableCell>
        {cells.includes("name") && (
          <TableCell>
            {user.first_name} {user.last_name}
          </TableCell>
        )}
        {/* */}
        {cells.includes("email") && <TableCell>{user.email}</TableCell>}
        {cells.includes("role") && (
          <TableCell>
            <Typography variant="subtitle2">{user.role.name}</Typography>
          </TableCell>
        )}
        {cells.includes("birth_date") && (
          <TableCell>
            {user.birth_date && dayjs(user.birth_date).format("DD.MM.YYYY")}
          </TableCell>
        )}
        {cells.includes("verified") && (
          <TableCell>
            {user.verified ? (
              <CheckCircleIcon color="success" sx={{ width: 32, height: 32 }} />
            ) : (
              <CancelIcon color="error" sx={{ width: 32, height: 32 }} />
            )}
          </TableCell>
        )}
        {cells.includes("organization") && (
          <TableCell>
            <Typography variant="subtitle2">
              {user.organization && user.organization.name}
            </Typography>
          </TableCell>
        )}
        {rolesConfig.users.modules.userDetail.visit.includes(userRole) ||
        (userId === user.id &&
          rolesConfig.users.modules.userDetail.visitSelf.includes(userRole)) ? (
          <TableCell>
            <Link href={`/user/detail/${user.id}`}>
              <Button>Detail</Button>
            </Link>
          </TableCell>
        ) : (
          <TableCell />
        )}
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
