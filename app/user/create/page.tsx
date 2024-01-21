import fetcher from "@/lib/fetcher";
import NewUserForm from "./NewUserForm";

const getRoles = async () => {
  const { data } = await fetcher(`/api/roles/list`, {
    cache: "no-cache",
  });
  return data;
};

export default async function CreateUserForm() {
  const roles = await getRoles();
  return <NewUserForm roles={roles} />;
}
