import NewUserForm from "./NewUserForm";
import { getRolesList } from "@/lib/api";

export default async function CreateUserForm() {
  const { data } = await getRolesList({ filter: true });

  return <NewUserForm roles={data} />;
}
