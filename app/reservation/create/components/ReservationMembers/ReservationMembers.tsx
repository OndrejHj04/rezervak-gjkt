import ReservationMembersRender from "./ReservationMembersRender";

const getGroups = async () => {
  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/group/list`,
      {
        cache: "no-cache",
      }
    );
    const { data } = await req.json();
    return data;
  } catch (e) {
    return [];
  }
};

const getUsers = async () => {
  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/list`,
      {
        cache: "no-cache",
      }
    );
    const { data } = await req.json();
    return data;
  } catch (e) {
    return [];
  }
};

export default async function ReservationMembers() {
  const groups = await getGroups();
  const users = await getUsers();
  return <ReservationMembersRender groups={groups} users={users} />;
}
