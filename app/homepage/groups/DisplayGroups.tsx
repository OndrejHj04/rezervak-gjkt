import { MenuList, Paper, Typography } from "@mui/material";
import SingleGroup from "./SingleGroup";
import GroupIcon from "@mui/icons-material/Group";
import { User, getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import GroupsPagination from "./GroupsPagination";

const getGroups = async (id: number, page: any) => {
  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/group/user-list?id=${id}&page=${page}`
    );
    const data = await req.json();

    return data;
  } catch (e) {
    return [];
  }
};

export default async function DisplayGroups({
  searchParams,
}: {
  searchParams: any;
}) {
  const data = (await getServerSession(authOptions)) as { user: User };

  const groups = data
    ? await getGroups(data.user.id, searchParams.groups || "1")
    : [];

  return (
    <Paper className="p-2">
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
      <GroupsPagination count={groups.count} />
    </Paper>
  );
}
