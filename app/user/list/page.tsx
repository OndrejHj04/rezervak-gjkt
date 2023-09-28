"use client";
import { store } from "@/store/store";
import UserListItem from "@/sub-components/UserListItem";
import {
  Avatar,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { User } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const getUsers = async () => {
  const req = await fetch("", {
    cache: "no-cache",
  });
  const { data } = await req.json();
  return data as User[];
};

export default function UserList() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { modal } = store();

  const fetchUsers = () => {
    setLoading(true);
    fetch("http://localhost:3000/api/users/list")
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setData(data.data);
      });
  };
  useEffect(() => {
    if (!modal) {
      fetchUsers();
    }
  }, [modal]);

  if (loading) {
    return (
      <Paper className="w-full p-2 flex justify-center">
        <CircularProgress className="mx-auto" />
      </Paper>
    );
  }
  if (data.length === 0) {
    return (
      <Paper className="w-full p-2 flex justify-center">
        <Typography variant="h5">Žádní uživatelé k zobrazení</Typography>
      </Paper>
    );
  }

  return (
    <Paper className="w-full p-2">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Jméno</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((user) => (
            <UserListItem key={user.id} user={user} />
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
// zde je potřeba pořešit, že když se přidá uživatel pomocí modalu, taxe zavře, ale zde se nový uživatel neobjeví -> loading && zobrazit
