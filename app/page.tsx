import { Button, Typography } from "@mui/material";
import { AdminCredentialsType, User } from "../models/User";
import AdminCredentials from "@/components/adminCredentials";
import { toast } from "react-toastify";

async function getAdminCredentials() {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/admin/credentials",
    { cache: "no-cache" }
  );
  const { data } = await res.json();
  return data[0] as AdminCredentialsType; //attention
}

export default async function Home() {
  const data = await getAdminCredentials();
  return (
    <>
      <AdminCredentials data={data} />
    </>
  );
}
