import { ListItemText, MenuItem, MenuList, Paper, Typography } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import { getUserGroupsWidgetData } from "@/lib/api";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import Link from "next/link";
import ClientScrollbar from "@/lib/ClientScrollbar";

export default async function GroupWidget() {
  const { user } = (await getServerSession(authOptions)) as any;

  const { data } = await getUserGroupsWidgetData({
    userId: user.id,
  });

  return (
    <Paper className="p-2 flex flex-col flex-1 min-w-[300px] max-h-full overflow-hidden">
      <div className="flex justify-between items-center gap-3">
        <GroupIcon color="primary" />
        <Typography variant="h5">Moje skupiny</Typography>
        <GroupIcon color="primary" />
      </div>
      <div className="flex-1 overflow-y-auto">
        <ClientScrollbar>
          <MenuList disablePadding>
            {data.map((group: any) => (
              <MenuItem key={group.id} className="!px-0" component={Link} href={`/group/detail/${group.id}/info`}>
                <ListItemText>{group.name}</ListItemText>
                <Typography color="text.secondary">Majitel: {group.leader_name}</Typography>
              </MenuItem>
            ))}
          </MenuList>
        </ClientScrollbar>
      </div>
    </Paper>
  );
}
