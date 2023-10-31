import { MenuList, Paper, Typography } from "@mui/material";
import SingleGroup from "./SingleGroup";
import GroupIcon from "@mui/icons-material/Group";

const getGroups = async () => {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/group/user-list?user_id=1`
  );
  const { data } = await req.json();

  return data;
};

export default async function DisplayGroups() {
  const groups = await getGroups();
  return (
    <Paper className="p-2">
      <div className="flex justify-between items-center gap-3">
        <GroupIcon color="primary" />
        <Typography variant="h5">Moje skupiny</Typography>
        <GroupIcon color="primary" />
      </div>
      <MenuList>
        {groups.length ? (
          groups.map((group: any) => (
            <SingleGroup key={group.id} group={group} />
          ))
        ) : (
          <Typography>žádné skupiny</Typography>
        )}
      </MenuList>
    </Paper>
  );
}
