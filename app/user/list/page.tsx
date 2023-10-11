import { store } from "@/store/store";
import UserListItem from "@/app/user/list/UserListItem";
import {
  Avatar,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Icon,
  IconButton,
  InputAdornment,
  List,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Popover,
  PopoverOrigin,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { User as NextAuthUser } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { toast } from "react-toastify";
import RemoveUser from "./removeUser";
import CheckboxComponent from "./checkboxComponent";

interface User extends NextAuthUser {
  full_name: string;
}

const getUsers = async () => {
  const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/list`, {
    cache: "no-cache",
  });
  const { data } = await req.json();

  return data as User[];
};

export default async function UserList() {
  const users = await getUsers();

  return (
    <div className="flex flex-col w-full gap-2">
      <RemoveUser />
      <Paper className="w-full p-2">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <CheckboxComponent users={users} />
              </TableCell>
              <TableCell></TableCell>
              <TableCell sx={{ padding: 1.5 }}>
                <Chip label="Jméno" />
              </TableCell>
              <TableCell sx={{ padding: 1.5 }}>
                <Chip label="Email" />
              </TableCell>
              <TableCell sx={{ padding: 1.5 }}>
                <Chip label="Role" />
              </TableCell>
              <TableCell sx={{ padding: 1.5 }}>
                <Chip label="Datum narození" />
              </TableCell>
              <TableCell sx={{ padding: 1.5 }}>
                <Chip label="Ověřený účet" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <UserListItem key={user.id} user={user} />
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
