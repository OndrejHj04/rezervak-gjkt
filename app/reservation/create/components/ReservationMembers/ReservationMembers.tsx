import fetcher from "@/lib/fetcher";
import ReservationMembersRender from "./ReservationMembersRender";

const getGroups = async (search: any, page: any) => {
  try {
    const data = await fetcher(
      `/api/group/list?limit=true&page=${page}&rpp=5${
        search.length ? `&search=${search}` : ""
      }`,
      {
        cache: "no-cache",
      }
    );
    return data;
  } catch (e) {
    return [];
  }
};

const getUsers = async (search: any, page: any) => {
  try {
    const data = await fetcher(
      `/api/users/list?page=${page}&rpp=5${
        search.length ? `&search=${search}` : ""
      }`,
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
  gpage,
  upage,
}: {
  users: any;
  groups: any;
  gpage: any;
  upage: any;
}) {
  const groupsList = await getGroups(groups, gpage);
  const usersList = await getUsers(users, upage);
  console.log(gpage);
  return <ReservationMembersRender groups={groupsList} users={usersList} />;
}
