"use client";
import { Group } from "@/types";
import { Avatar, CardHeader, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";

export default function SingleGroup({ group }: { group: Group }) {
  const { push } = useRouter();
  console.log(group);
  return (
    <MenuItem className="p-0" onClick={() => push(`/group/detail/${group.id}`)}>
      <CardHeader
        avatar={<Avatar>{group.name[0]}</Avatar>}
        title={group.name}
        subheader={`Majitel: ${group.owner.first_name} ${group.owner.last_name}`}
      />
    </MenuItem>
  );
}
