import UsersImportForm from "./UsersImportForm";

const getRoles = async () => {
  const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/roles/list`, {
    cache: "no-cache",
  });
  const { data } = await req.json();
  return data;
};

export default async function ImportUsersForm() {
  const roles = await getRoles();

  return <UsersImportForm roles={roles} />;
}
