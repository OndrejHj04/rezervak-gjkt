import { Typography } from "@mui/material";
import { usePathname } from "next/navigation";

const getUserData = async (id) => {
  const req = await fetch(`http://localhost:3000/api/getuserdata?id=${id}`, {
    cache: "no-cache",
    method: "GET",
  });
  const data = await req.json();
  return data;
};

export default async function Profile({ params: { id } }) {
  const data = await getUserData(id);
  const { full_name, email } = data;

  return (
    <div>
      <Typography variant="h4">Profile</Typography>
      <Typography variant="h6">Full Name: {full_name}</Typography>
      <Typography variant="h6">Email: {email}</Typography>
    </div>
  );
}
