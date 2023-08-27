import {
  Avatar,
  Badge,
  Divider,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { usePathname } from "next/navigation";
import ChangeIcon from "@/components/ChangeIcon";

const getUserData = async (id) => {
  const req = await fetch(`http://localhost:3000/api/getuserdata?id=${id}`, {
    cache: "no-cache",
    method: "GET",
  });

  return req.json();
};

export default async function Profile({ params: { id } }) {
  const { data } = await getUserData(id);
  if (!data) {
    return <Typography variant="h4">User not found</Typography>;
  }
  console.log(data);
  return (
    <div className="sm:p-5 p-2 flex gap-4 sm:flex-row flex-col">
      <Paper className="flex flex-col gap-2 p-5 w-fit" elevation={12}>
        <div className="flex gap-2 items-center">
          <div className="h-16 w-16">
            <ChangeIcon photo={data.photo} />
          </div>
          <Typography variant="h4">{data.full_name}</Typography>
        </div>
        <Divider />
        <div>
          <Typography>email: {data.email}</Typography>
          <Typography>
            zobrazení aplikace: {data.theme === "dark" ? "tmavé" : "světlé"}
          </Typography>
        </div>
      </Paper>
      <Paper
        className="flex flex-col gap-2 h-fit p-5 sm:flex-1 flex-auto w-fit"
        elevation={12}
      >
        <Typography variant="h4">Moje rezervace</Typography>
        <Divider />
        <Typography>Žádné rezervace k zobrazení</Typography>
      </Paper>
    </div>
  );
}
