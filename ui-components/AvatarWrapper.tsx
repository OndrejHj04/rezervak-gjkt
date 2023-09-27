import { Avatar } from "@mui/material";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

export default function AvatarWrapper({ user }: { user?: User }) {
  const { data } = useSession();

  if (user) {
    if (!user.image?.length) {
      return (
        <Avatar>
          {user.first_name[0].toUpperCase()}
          {user.last_name[0].toUpperCase()}
        </Avatar>
      );
    } else {
      return <Avatar src={user.image} />;
    }
  }

  if (!data?.user.image?.length) {
    <Avatar>
      {data?.user.first_name[0].toUpperCase()}
      {data?.user.last_name[0].toUpperCase()}
    </Avatar>;
  }
  return <Avatar />;
}
