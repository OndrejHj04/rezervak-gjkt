import { Box } from "@mui/material";
import { User } from "next-auth";
import UserDetailForm from "./UserDetailForm";


export default async function UserDetail({
  params: { id },
}: {
  params: { id: string };
}) {

  return (
    <Box className="w-full">
      <UserDetailForm id={id}/>
    </Box>
  );
}
