import { MenuItem, MenuList, Paper, Typography } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import { Group } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SingleGroup from "@/app/group/SingleGroup";

const getGroups = async () => {
  const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/list`);
  const { data } = await req.json();
  return data;
};

export default async function DisplayGroups() {
  const groups = (await getGroups()) as Group[];
  return (
    <Paper className="p-2">
      <div className="flex justify-between items-center gap-3">
        <GroupIcon color="primary" />
        <Typography variant="h5">Moje skupiny</Typography>
        <GroupIcon color="primary" />
      </div>
      <MenuList>
        {groups.map((group) => (
          <SingleGroup key={group.id} group={group} />
        ))}
      </MenuList>
    </Paper>
  );
}
