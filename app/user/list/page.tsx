"use client";
import { store } from "@/store/store";
import UserListItem from "@/sub-components/UserListItem";
import {
  Avatar,
  Chip,
  CircularProgress,
  Icon,
  IconButton,
  InputAdornment,
  Paper,
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

interface User extends NextAuthUser {
  full_name: string;
}

const getUsers = async () => {
  const req = await fetch("", {
    cache: "no-cache",
  });
  const { data } = await req.json();
  return data as User[];
};

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { modal } = store();

  useEffect(() => {
    if (search.length) {
      const filtered = users.filter((user) => {
        return user.full_name.toLowerCase().includes(search.toLowerCase());
      });

      setData(filtered);
    } else {
      setData(users);
    }
  }, [search, users]);

  const fetchUsers = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/list`)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setUsers(data.data);
      });
  };
  useEffect(() => {
    if (!modal) {
      fetchUsers();
    }
  }, [modal]);

  const searchBar = (
    <TextField
      placeholder="Hledat"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-64"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            {!!search.length && (
              <IconButton onClick={() => setSearch("")}>
                <CancelIcon />
              </IconButton>
            )}
          </InputAdornment>
        ),
      }}
    />
  );

  if (loading) {
    return (
      <Paper className="w-full p-2 flex justify-center">
        <CircularProgress className="mx-auto" />
      </Paper>
    );
  }
  if (data.length === 0) {
    return (
      <div className="flex flex-col w-full gap-2">
        {searchBar}
        <Paper className="w-full p-2 flex justify-center">
          <Typography variant="h5">Žádní uživatelé k zobrazení</Typography>
        </Paper>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-2">
      {searchBar}
      <Paper className="w-full p-2">
        <Table>
          <TableHead>
            <TableRow>
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
            {data.map((user) => (
              <UserListItem key={user.id} user={user} />
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
// zde je potřeba pořešit, že když se přidá uživatel pomocí modalu, taxe zavře, ale zde se nový uživatel neobjeví -> loading && zobrazit
