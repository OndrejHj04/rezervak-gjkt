import { Typography } from "@mui/material";
import CreateReservationWrapper from "./CreateReservationWrapper";

const getUsers = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/list`);
  const { data } = await res.json();
  return data;
};

const getGroups = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/list`, {
    cache: "no-cache",
  });
  const { data } = await res.json();
  return data;
};

export default async function CreateReservation() {
  const users = await getUsers();
  const groups = await getGroups();

  return <CreateReservationWrapper groups={groups} users={users} />;
}
