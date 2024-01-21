import fetcher from "@/lib/fetcher";
import UsersImportForm from "./UsersImportForm";

const getRoles = async () => {
  const { data } = await fetcher(`/api/roles/list`, {
    cache: "no-cache",
  });

  return data;
};

export default async function ImportUsersForm() {
  const roles = await getRoles();

  return <UsersImportForm roles={roles} />;
}
