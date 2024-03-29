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
import GroupListItem from "./components/GroupListItem";
import TableListPagination from "@/ui-components/TableListPagination";
import { rolesConfig } from "@/lib/rolesConfig";
import GroupsDelete from "./components/GroupsDelete";
import fetcher from "@/lib/fetcher";
import GroupListFilter from "./components/GroupListFilter";

const getGroups = async (page: any, search: any) => {
  const data = await fetcher(
    `/api/group/list?page=${page}${search ? `&search=${search}` : ""}`,
    { cache: "no-cache" }
  );
  return data;
};

export default async function GroupList({
  searchParams,
  userRole,
  userId,
}: {
  searchParams: any;
  userRole: any;
  userId: any;
}) {
  const page = searchParams["page"] || 1;
  const search = searchParams["search"] || "";

  const groups = (await getGroups(page, search)) as any;

  if (!groups) return <div>loading...</div>;
  return (
    <div className="flex flex-col w-full gap-2">
      <GroupListFilter userRole={userRole} />
      <Paper className="w-full p-2">
        <Box sx={{ overflow: "auto" }}>
          <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {rolesConfig.groups.modules.groupsTable.config.topbar.delete.includes(
                    userRole
                  ) && (
                    <TableCell sx={{ padding: 1.5 }}>
                      <GroupsDelete />
                    </TableCell>
                  )}
                  <TableCell sx={{ padding: 1.5 }}>
                    <Chip label="Název" />
                  </TableCell>
                  <TableCell sx={{ padding: 1.5 }}>
                    <Chip label="Popis" />
                  </TableCell>
                  <TableCell sx={{ padding: 1.5 }}>
                    <Chip label="Počet členů" />
                  </TableCell>
                  <TableCell sx={{ padding: 1.5 }}>
                    <Chip label="Vlastník" />
                  </TableCell>
                  <TableCell sx={{ padding: 1.5 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {groups?.data?.map((group: any) => (
                  <GroupListItem
                    group={group}
                    key={group.id}
                    userRole={userRole}
                    userId={userId}
                  />
                ))}
              </TableBody>
            </Table>
            <TableListPagination
              name="page"
              rpp={10}
              count={groups.count || 0}
            />
          </Box>
        </Box>
      </Paper>
    </div>
  );
}
