import UserListItem from "@/app/user/list/components/UserListItem";
import {
  Box,
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
import fetcher from "@/lib/fetcher";
import UserListFilter from "./components/UserListFilter";

const getUsers = async (page: any, search: any, role: any) => {
  const data = await fetcher(
    `/api/users/list?page=${page}&role=${role}${
      search.length ? `&search=${search}` : ""
    }`,
    {
      cache: "no-cache",
    }
  );
  return data;
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
  return (
    <div className="flex flex-col w-full gap-2">
      <UserListFilter userRole={userRole} />
      <Paper className="w-full p-2">
        <Box sx={{ overflow: "auto" }}>
          <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
            <Table size="small">
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
                  ).map((item: any) => (
                    <TableCell
                      sx={{ padding: 1.5 }}
                      key={columns[item as never]}
                    >
                      <Chip label={columns[item as never]} />
                    </TableCell>
                  ))}
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
          </Box>
        </Box>
      </Paper>
    </div>
  );
}
