import {
  Avatar,
  Card,
  CardHeader,
  Divider,
  IconButton,
  Paper,
  Slide,
  Typography,
} from "@mui/material";
import UserSmallCard from "@/sub-components/UserSmallCard";
import { User } from "@/models/User";

const getUsers = async () => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/users/list"
  );
  const { data } = await response.json();
  return data as User[];
};

export default async function WhiteList() {
  const data = await getUsers();
  console.log(data);
  return (
    <Paper className="flex flex-col p-2 gap-2 h-min">
      <Typography variant="h5">Seznam uživatelů</Typography>
      <Divider />
      {data.map((user) => (
        <UserSmallCard user={user} key={user.id} />
      ))}
    </Paper>
  );
}
