import { MenuList, Paper, Typography } from "@mui/material";
import SingleGroup from "./SingleGroup";
import GroupIcon from "@mui/icons-material/Group";
import { User, getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import GroupsPagination from "./GroupsPagination";
import fetcher from "@/lib/fetcher";

const getGroups = async (id: number, page: any) => {
  try {
    const data = await fetcher(`/api/group/user-list?id=${id}&page=${page}`, {
      cache: "no-cache",
    });

    return data;
  } catch (e) {
    return [];
  }
};

export default async function DisplayGroups({
  searchParams,
  data,
}: {
  searchParams: any;
  data: any;
}) {
  const groups = data
    ? await getGroups(data.user.id, searchParams.groups || "1")
    : [];

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
        <GroupsPagination count={groups.count} />
      </div>
    </Paper>
  );
}
