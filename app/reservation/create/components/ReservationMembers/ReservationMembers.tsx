import fetcher from "@/lib/fetcher";
import ReservationMembersRender from "./ReservationMembersRender";

const getGroups = async () => {
  try {
    const { data } = await fetcher(`/api/group/list`, {
      cache: "no-cache",
    });
    return data;
  } catch (e) {
    return [];
  }
};

const getUsers = async () => {
  try {
    const { data } = await fetcher(`/api/users/list`, {
      cache: "no-cache",
    });
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
