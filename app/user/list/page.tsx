import UserListItem from "@/sub-components/UserListItem";
import {
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { User } from "next-auth";
import Link from "next/link";

const getUsers = async () => {
  const req = await fetch("http://localhost:3000/api/users/list", {
    cache: "no-cache",
  });
  const { data } = await req.json();
  return data as User[];
};

export default async function UserList() {
  const data = await getUsers();

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
          {data.length ? (
            data.map((user) => <UserListItem key={user.id} user={user} />)
          ) : (
            <TableRow>
              <TableCell colSpan={4}>Žádní uživatelé</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}
