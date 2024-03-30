import UsersImportForm from "./UsersImportForm";
import { getRolesList } from "@/lib/api";

export default async function ImportUsersForm() {
  const { data: roles } = await getRolesList({ filter: false });

  return <UsersImportForm roles={roles} />;
}
