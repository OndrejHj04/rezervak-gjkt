import { Group } from "@/types";
import { Avatar, CardHeader, MenuItem } from "@mui/material";
import Link from "next/link";

export default function SingleGroup({ group }: { group: Group }) {
  return (
    <Link
      href={`/group/detail/${group.id}`}
      className="no-underline text-inherit"
    >
      <MenuItem className="p-0">
        <CardHeader
          avatar={<Avatar>{group.name[0]}</Avatar>}
          title={group.name}
          subheader={`Majitel: ${group.owner.first_name} ${group.owner.last_name}`}
        />
      </MenuItem>
    </Link>
  );
}
