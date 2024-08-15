import NewUserForm from "./NewUserForm";
import { getRolesList, getUserList } from "@/lib/api";

export default async function CreateUserForm() {
  const { data } = await getRolesList({ filter: true });
  const { data: users } = await getUserList({ withChildrenCollapsed: true });

  return <NewUserForm roles={data} users={users} />;
}
