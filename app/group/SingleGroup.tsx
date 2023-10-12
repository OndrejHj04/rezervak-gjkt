"use client";
import { Group } from "@/types";
import { MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";

export default function SingleGroup({ group }: { group: Group }) {
  const { push } = useRouter();
  return (
    <MenuItem onClick={() => push(`/group/detail/${group.id}`)}>
      {group.name}
    </MenuItem>
  );
}
