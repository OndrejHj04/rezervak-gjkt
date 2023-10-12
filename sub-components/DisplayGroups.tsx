import { MenuItem, MenuList, Paper, Typography } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import { Group } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SingleGroup from "@/app/group/SingleGroup";
import { store } from "@/store/store";
import { User, getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const getGroups = async (id: number) => {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/group/user-list?user_id=${id}`
  );
  const { data } = await req.json();

  return data;
};

export default async function DisplayGroups() {
  const { user } = (await getServerSession(authOptions)) as { user: User };
  const groups = (await getGroups(user.id)) as Group[];

  return (
    <Paper className="p-2">
      <div className="flex justify-between items-center gap-3">
        <GroupIcon color="primary" />
        <Typography variant="h5">Moje skupiny</Typography>
        <GroupIcon color="primary" />
      </div>
      <MenuList>
        {groups.length ? (
          groups.map((group) => <SingleGroup key={group.id} group={group} />)
        ) : (
          <Typography>nejste členem žádné skupiny</Typography>
        )}
      </MenuList>
    </Paper>
  );
}
