import NewUserForm from "./NewUserForm";
import { getUsersBySearch } from "@/lib/api";

export default async function CreateUserForm() {
  const { data } = await getUsersBySearch();

  return <NewUserForm options={data} />;
}
