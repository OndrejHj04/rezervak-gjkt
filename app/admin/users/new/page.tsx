import NewUserForm from "./NewUserForm";

const getRoles = async () => {
  const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/roles/list`, {
    cache: "no-cache",
  });
  const { data } = await req.json();
  return data;
};

export default async function CreateUserForm() {
  const roles = await getRoles();
  return <NewUserForm roles={roles} />;
}
