import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import GroupListItem from "./GroupListItem";
import RemoveGroups from "./RemoveGroupButton";
import ExportGroups from "./ExportGroups";
import SearchBar from "@/ui-components/SearchBar";
import TableListPagination from "@/ui-components/TableListPagination";

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

export default async function Page({ searchParams }: { searchParams: any }) {
  const page = searchParams["page"] || 1;
  const search = searchParams["search"] || "";

  const groups = (await getGroups(page, search)) as any;

  if (!groups) return <div>loading...</div>;
  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex justify-between">
        <RemoveGroups />
        <SearchBar label={"skupiny"} />
        <ExportGroups />
      </div>
      <Paper className="w-full p-2">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ padding: 1.5 }} />
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
              <TableCell sx={{ padding: 1.5 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups?.data?.map((group: any) => (
              <GroupListItem group={group} key={group.id} />
            ))}
          </TableBody>
        </Table>
        <TableListPagination count={groups.count} />
      </Paper>
    </div>
  );
}
