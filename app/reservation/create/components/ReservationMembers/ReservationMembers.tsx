import fetcher from "@/lib/fetcher";
import ReservationMembersRender from "./ReservationMembersRender";
import { getUserList } from "@/lib/api";

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
  const usersList = await getUserList({ search: users, page: upage });

  return <ReservationMembersRender groups={groupsList} users={usersList} />;
}
