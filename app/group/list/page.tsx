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
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import GroupListItem from "./GroupListItem";
import { toast } from "react-toastify";
import { group } from "console";
import { store } from "@/store/store";
import RemoveGroups from "./RemoveGroupButton";

const getGroups = async () => {
  const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/list`);
  const { data } = await req.json();
  return data;
};

export default async function Page() {
  const groups = (await getGroups()) as Group[];

  return (
    <div className="flex flex-col w-full gap-2">
      <RemoveGroups />
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
            {groups.map((group) => (
              <GroupListItem group={group} key={group.id} />
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
