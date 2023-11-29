import { Group } from "@/types";
import { Avatar, CardHeader, MenuItem, Typography } from "@mui/material";
import Link from "next/link";

export default function SingleGroup({ group }: { group: Group }) {
  return (
    <Link
      href={`/group/detail/${group.id}`}
      className="no-underline text-inherit"
    >
      <MenuItem className="flex justify-between gap-2">
        <Typography>{group.name}</Typography>
        <Typography
          color="text.secondary"
          sx={{ fontSize: 14 }}
        >{`Majitel: ${group.owner.first_name} ${group.owner.last_name}`}</Typography>
      </MenuItem>
    </Link>
  );
}
