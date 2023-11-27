import UserListItem from "@/app/user/list/components/UserListItem";
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

import RemoveUser from "./components/removeUser";
import CheckboxComponent from "./components/checkboxComponent";
import UserRolesSelect from "./components/RolesSelect";
import SearchBar from "@/ui-components/SearchBar";
import TableListPagination from "@/ui-components/TableListPagination";
import ExportButton from "@/ui-components/ExportButton";

interface User extends NextAuthUser {
  full_name: string;
}

const getUsers = async (page: any, search: any, role: any) => {

  const req = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL
    }/api/users/list?page=${page}&role=${role}${
      search.length ? `&search=${search}` : ""
    }`,
    {
      cache: "no-cache",
    }
  );
  const data = await req.json();

  return data;
};

const getRoles = async () => {
  const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/roles/list`);
  const { data } = await req.json();

  return data as any;
};
export default async function UserList({
  searchParams,
}: {
  searchParams: any;
}) {
  const role = searchParams["role"] || 0;
  const page = searchParams["page"] || 1;
  const search = searchParams["search"] || "";

  const users = await getUsers(page, search, role);
  const roles = await getRoles();

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex justify-between">
        <RemoveUser />
        <SearchBar label="uživatele" />
        <div>
          <UserRolesSelect roles={roles} />
          <ExportButton prop="users" />
        </div>
      </div>
      <Paper className="w-full p-2">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <CheckboxComponent users={users.data} />
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
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {users.data.map((user: any) => (
              <UserListItem key={user.id} user={user} />
            ))}
          </TableBody>
        </Table>
        <TableListPagination count={users.count} />
      </Paper>
    </div>
  );
}
