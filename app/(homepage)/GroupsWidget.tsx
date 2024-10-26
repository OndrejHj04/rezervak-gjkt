import { MenuItem, MenuList, Paper, Typography } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import { userSpecifiedGroups } from "@/lib/api";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import Link from "next/link";


export default async function GroupWidget() {
  const user = (await getServerSession(authOptions)) as any;

  const groups = await userSpecifiedGroups({
    id: user?.user.id,
  });

  return (
    <Paper className="p-2 flex flex-col" style={{ minWidth: "300px" }}>
      <div className="flex justify-between items-center gap-3">
        <GroupIcon color="primary" />
        <Typography variant="h5">Moje skupiny</Typography>
        <GroupIcon color="primary" />
      </div>
      <MenuList>
        {groups.data?.map((group: any) => (
          <MenuItem key={group.id} className="flex !justify-between gap-2 px-1" component={Link} href={`/group/detail/${group.id}`}>
            <Typography noWrap>{group.name}</Typography>
            <div className="flex items-center gap-2">
              <Typography
                color="text.secondary"
                sx={{ fontSize: 14 }}
              >{`Majitel: ${group.owner.first_name} ${group.owner.last_name}`}</Typography>
            </div>
          </MenuItem>
        ))}
      </MenuList>
    </Paper>
  );
}
