import { MenuList, Paper, Typography } from "@mui/material";
import SingleGroup from "./SingleGroup";
import GroupIcon from "@mui/icons-material/Group";
import TableListPagination from "@/ui-components/TableListPagination";
import { userSpecifiedGroups } from "@/lib/api";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export default async function DisplayGroups({
  searchParams,
}: {
  searchParams: any;
}) {
  const user = (await getServerSession(authOptions)) as any;

  const groups = await userSpecifiedGroups({
    id: user.user.id,
    page: Number(searchParams.groups) || 1,
  });

  return (
    <Paper className="p-2 flex flex-col">
      <div className="flex justify-between items-center gap-3">
        <GroupIcon color="primary" />
        <Typography variant="h5">Moje skupiny</Typography>
        <GroupIcon color="primary" />
      </div>
      <MenuList>
        {groups.data.length ? (
          groups.data?.map((group: any) => (
            <SingleGroup key={group.id} group={group} />
          ))
        ) : (
          <Typography className="text-center">
            nejste členem žádné skupiny
          </Typography>
        )}
      </MenuList>
      <div className="mt-auto">
        <TableListPagination rpp={10} name="groups" count={groups.count || 0} />
      </div>
    </Paper>
  );
}
