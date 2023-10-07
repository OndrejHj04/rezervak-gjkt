"use client";
import { store } from "@/store/store";
import { GroupOwner } from "@/types";
import { Avatar, styled } from "@mui/material";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

export default function AvatarWrapper({
  data,
  size,
}: {
  data?: User | GroupOwner;
  size?: number;
}) {
  const { user } = store();
  const sizes = size || 40;
  if (data) {
    if (!data?.image?.length) {
      return (
        <Avatar sx={{ height: sizes, width: sizes }}>
          {data?.first_name[0].toUpperCase()}
          {data?.last_name[0].toUpperCase()}
        </Avatar>
      );
    } else {
      return <Avatar src={data?.image} sx={{ height: sizes, width: sizes }} />;
    }
  }

  if (user) {
    if (user.image?.length) {
      return <Avatar src={user?.image} sx={{ height: sizes, width: sizes }} />;
    } else {
      return (
        <Avatar sx={{ height: sizes, width: sizes }}>
          {user.first_name[0].toUpperCase()}
          {user.last_name[0].toUpperCase()}
        </Avatar>
      );
    }
  }

  return <Avatar />;
}
