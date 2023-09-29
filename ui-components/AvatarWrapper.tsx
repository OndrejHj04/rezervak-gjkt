"use client";
import { store } from "@/store/store";
import { Avatar } from "@mui/material";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

export default function AvatarWrapper({ data }: { data?: User }) {
  const { user } = store();

  if (data) {
    if (!data?.image?.length) {
      return (
        <Avatar>
          {data?.first_name[0].toUpperCase()}
          {data?.last_name[0].toUpperCase()}
        </Avatar>
      );
    } else {
      return <Avatar src={data?.image} />;
    }
  }

  if (user) {
    if (user.image?.length) {
      return <Avatar src={user?.image} />;
    } else {
      return (
        <Avatar>
          {user.first_name[0].toUpperCase()}
          {user.last_name[0].toUpperCase()}
        </Avatar>
      );
    }
  }

  return <Avatar />;
}
