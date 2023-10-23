import ReservationMembersRender from "./ReservationMembersRender";

const getGroups = async () => {
  const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/list`);
  const { data } = await req.json();
  return data;
};

const getUsers = async () => {
  const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/list`);
  const { data } = await req.json();
  return data;
};

export default async function ReservationMembers() {
  const groups = await getGroups();
  const users = await getUsers();
  return <ReservationMembersRender groups={groups} users={users} />;
}
