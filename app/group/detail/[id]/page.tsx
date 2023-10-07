"use client";
import { Group } from "@/types";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import {
  Avatar,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/detail/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setGroup(res.data);
        setLoading(false);
      })
      .catch((e) => setLoading(false));
  }, []);

  if (loading)
    return (
      <Paper className="flex p-4 justify-center">
        <CircularProgress />
      </Paper>
    );

  if (!group) {
    return (
      <Paper className="flex w-full p-2">
        <Typography>Not found</Typography>
      </Paper>
    );
  }
  return (
    <div className="flex gap-2">
      <Paper className="flex flex-col p-2 gap-1 h-min">
        <Typography variant="h5">Majitel skupiny</Typography>
        <Divider />
        <div className="flex gap-2">
          <AvatarWrapper size={58} data={group.owner} />
          <div className="flex flex-col justify-between">
            <Typography variant="h6">
              {group.owner.first_name} {group.owner.last_name}
            </Typography>
            <Typography>{group.owner.email}</Typography>
          </div>
        </div>
      </Paper>

      <Paper className="flex flex-col p-2 gap-1">
        <Typography variant="h5">Akce</Typography>
        <Divider />
        <div className="flex flex-col gap-2">
          <Button variant="outlined">Přidat uživatele</Button>
          <Button variant="outlined">Vytvořit rezervaci</Button>
          <Button variant="outlined">Odebrat uživatele</Button>
        </div>
      </Paper>
    </div>
  );
}
