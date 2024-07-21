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

import RemoveUser from "./components/removeUser";
import TableListPagination from "@/ui-components/TableListPagination";
import { rolesConfig } from "@/lib/rolesConfig";
import UserListFilter from "./components/UserListFilter";
import { getUserList } from "@/lib/api";

const columns = {
  name: "Jméno",
  email: "Email",
  role: "Role",
  birth_date: "Datum narození",
  verified: "Ověřený účet",
  organization: "Organizace",
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
  const organization = searchParams["organization"] || 0;
  const page = searchParams["page"] || 1;
  const search = searchParams["search"] || "";

  const users = await getUserList({
    page,
    search,
    role: Number(role),
    organization: Number(organization),
  });

  return (
    <div className="flex flex-col w-full gap-2">
      <UserListFilter userRole={userRole} />
      <Paper className="w-full p-2">
        <Box sx={{ overflow: "auto" }}>
          <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell />
                  {rolesConfig.users.modules.userTable.config.delete.includes(
                    userRole
                  ) && (
                    <>
                      <TableCell>
                        <RemoveUser />
                      </TableCell>
                    </>
                  )}
                  <TableCell />
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
            <TableListPagination
              count={users.count || 0}
              name="page"
              rpp={10}
            />
          </Box>
        </Box>
      </Paper>
    </div>
  );
}
