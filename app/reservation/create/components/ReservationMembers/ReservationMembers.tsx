import fetcher from "@/lib/fetcher";
import ReservationMembersRender from "./ReservationMembersRender";

const getGroups = async (search: any) => {
  try {
    const { data } = await fetcher(
      `/api/group/list?limit=true${search.length ? `&search=${search}` : ""}`,
      {
        cache: "no-cache",
      }
    );
    return data;
  } catch (e) {
    return [];
  }
};

const getUsers = async (search: any) => {
  try {
    const { data } = await fetcher(
      `/api/users/list${search.length ? `?search=${search}` : ""}`,
      {
        cache: "no-cache",
      }
    );
    return data;
  } catch (e) {
    return [];
  }
};

export default async function ReservationMembers({
  users,
  groups,
}: {
  users: any;
  groups: any;
}) {
  const groupsList = await getGroups(groups);
  const usersList = await getUsers(users);

  return <ReservationMembersRender groups={groupsList} users={usersList} />;
}
