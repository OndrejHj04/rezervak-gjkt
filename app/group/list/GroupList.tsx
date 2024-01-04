import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import GroupListItem from "./components/GroupListItem";
import RemoveGroups from "./components/RemoveGroupButton";
import SearchBar from "@/ui-components/SearchBar";
import TableListPagination from "@/ui-components/TableListPagination";
import ExportButton from "@/ui-components/ExportButton";
import { rolesConfig } from "@/rolesConfig";

const getGroups = async (page: any, search: any) => {
  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/group/list?page=${page}${
        search ? `&search=${search}` : ""
      }`,
      { cache: "no-cache" }
    );
    const data = await req.json();
    return data;
  } catch (e) {
    return [];
  }
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
      <div className="flex gap-3 justify-end">
        {rolesConfig.groups.modules.groupsTable.config.topbar.search.includes(
          userRole
        ) && <SearchBar label={"skupiny"} />}
        {rolesConfig.groups.modules.groupsTable.config.topbar.export.includes(
          userRole
        ) && <ExportButton prop={"groups"} />}
      </div>
      <Paper className="w-full p-2">
        <Table>
          <TableHead>
            <TableRow>
              {rolesConfig.groups.modules.groupsTable.config.delete.includes(
                userRole
              ) && (
                <TableCell sx={{ padding: 1.5 }}>
                  <RemoveGroups />
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
        <TableListPagination count={groups.count} />
      </Paper>
    </div>
  );
}
