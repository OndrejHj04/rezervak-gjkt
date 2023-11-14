import { Group } from "@/types";
import {
  Button,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import GroupListItem from "./GroupListItem";
import { toast } from "react-toastify";
import { group } from "console";
import { store } from "@/store/store";
import RemoveGroups from "./RemoveGroupButton";
import { GroupTablePagination } from "./GroupTablePagination";
import SearchBar from "./SearchBar";
import ExportGroups from "./ExportGroups";

const getGroups = async (page: any) => {
  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/group/list?page=${page}`,
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
  const search = searchParams["search"] || 1;

  const groups = (await getGroups(page)) as any;

  if (!groups) return <div>loading...</div>;
  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex justify-between">
        <RemoveGroups />
        <SearchBar />
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
            {groups.data.map((group: any) => (
              <GroupListItem group={group} key={group.id} />
            ))}
          </TableBody>
        </Table>
        <GroupTablePagination count={groups.count} />
      </Paper>
    </div>
  );
}
