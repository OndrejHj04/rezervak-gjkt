import { Group } from "@/types";
import { Avatar, CardHeader, MenuItem, Typography } from "@mui/material";
import Link from "next/link";

export default function SingleGroup({ group }: { group: any }) {
  return (
    <Link
      href={`/group/detail/${group.id}`}
      className="no-underline text-inherit"
    >
      <MenuItem className="flex !justify-between gap-2 px-1">
        <Typography noWrap>{group.name}</Typography>
        <div className="flex items-center gap-2">
          <Typography
            color="text.secondary"
            sx={{ fontSize: 14 }}
          >{`Majitel: ${group.owner.first_name} ${group.owner.last_name}`}</Typography>
        </div>
      </MenuItem>
    </Link>
  );
}
