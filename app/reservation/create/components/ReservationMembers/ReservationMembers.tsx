import ReservationMembersRender from "./ReservationMembersRender";
import { getGroupList, getUserList } from "@/lib/api";

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
  const groupsList = await getGroupList({
    page: gpage,
    limit: true,
    rpp: 5,
    search: groups || "",
  });
  const usersList = await getUserList({ search: users, page: upage });

  return <ReservationMembersRender groups={groupsList} users={usersList} />;
}
