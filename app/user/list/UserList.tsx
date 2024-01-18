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
import { rolesConfig } from "@/rolesConfig";

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

const columns = {
  name: "Jméno",
  email: "Email",
  role: "Role",
  birth_date: "Datum narození",
  verified: "Ověřený účet",
};
export default async function UserList({
  searchParams,
  userRole,
  userId,
}: {
  searchParams: any;
  userRole: any;
  userId: any;
}) {
  const role = searchParams["role"] || 0;
  const page = searchParams["page"] || 1;
  const search = searchParams["search"] || "";

  const users = await getUsers(page, search, role);
  const roles = await getRoles();
  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex gap-3 justify-end">
        {rolesConfig.users.modules.userTable.config.topbar.search.includes(
          userRole
        ) && <SearchBar label="uživatele" />}
        {rolesConfig.users.modules.userTable.config.topbar.filter.includes(
          userRole
        ) && <UserRolesSelect roles={roles} />}
        {rolesConfig.users.modules.userTable.config.topbar.export.includes(
          userRole
        ) && <ExportButton prop="users" />}
      </div>
      <Paper className="w-full p-2">
        <Table>
          <TableHead>
            <TableRow>
              {rolesConfig.users.modules.userTable.config.delete.includes(
                userRole
              ) && (
                <>
                  <TableCell>
                    <RemoveUser />
                  </TableCell>
                </>
              )}
              <TableCell></TableCell>
              {(
                rolesConfig.users.modules.userTable.columns[
                  userRole as never
                ] as any
              ).map((item: any) => {
                console.log();
                return (
                  <TableCell sx={{ padding: 1.5 }} key={columns[item as never]}>
                    <Chip label={columns[item as never]} />
                  </TableCell>
                );
              })}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {users.data.map((user: any) => (
              <UserListItem
                key={user.id}
                user={user}
                userRole={userRole}
                userId={userId}
              />
            ))}
          </TableBody>
        </Table>
        <TableListPagination count={users.count} />
      </Paper>
    </div>
  );
}
