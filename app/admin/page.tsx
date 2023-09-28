import { AdminCredentialsType } from "@/models/User";
import { Typography } from "@mui/material";

export default async function Admin() {
  return (
    <div className="flex gap-2">
      <Typography>admin</Typography>
      {/* <AdminCredentials data={data} /> */}
      {/* <RolesComponent /> */}
    </div>
  );
}
