"use client";
import { Group } from "@/types";
import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import GroupListItem from "../../../sub-components/GroupListItem";

export default function Page() {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/list`)
      .then((res) => res.json())
      .then((res) => setGroups(res.data));
  }, []);

  return (
    <Paper className="w-full p-2">
      <Table>
        <TableHead>
          <TableRow>
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
            <GroupListItem key={group.id} group={group} />
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
