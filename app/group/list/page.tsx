"use client";
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
import GroupListItem from "../../../sub-components/GroupListItem";
import { toast } from "react-toastify";
import { group } from "console";

export default function Page() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const getGroupList = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/list`)
      .then((res) => res.json())
      .then((res) => {
        setGroups(res.data);
        setLoading(false);
        setSelected([]);
      });
  };
  const handleRemoveGroups = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/remove`, {
      method: "POST",
      body: JSON.stringify({ groups: selected }),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Skupiny byly úspěšně odstraněny");
        getGroupList();
      })
      .catch((err) => toast.error("Něco se pokazilo"));
  };

  useEffect(() => {
    getGroupList();
  }, []);

  if (loading) {
    return (
      <Paper className="w-full flex justify-center p-2">
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex justify-end">
        <Button
          variant="contained"
          color="error"
          disabled={!selected.length}
          onClick={handleRemoveGroups}
        >
          odstranit skupiny
        </Button>
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
            {!loading && !groups.length ? (
              <Typography variant="h6">Žádné skupiny k zobrazení</Typography>
            ) : (
              groups.map((group) => (
                <GroupListItem
                  key={group.id}
                  group={group}
                  setSelected={setSelected}
                  selected={selected}
                />
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
