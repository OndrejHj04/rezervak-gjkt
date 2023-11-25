import UserListItem from "@/app/user/list/UserListItem";
import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { User as NextAuthUser } from "next-auth";

import RemoveUser from "./removeUser";
import CheckboxComponent from "./checkboxComponent";

interface User extends NextAuthUser {
  full_name: string;
}

const getUsers = async () => {
  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/list`,
      {
        cache: "no-cache",
      }
    );
    const { data } = await req.json();

    return data as User[];
  } catch (e) {
    return [];
  }
};

export default async function UserList() {
  const users = await getUsers();

  if (!users) return <div>loading...</div>;
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
