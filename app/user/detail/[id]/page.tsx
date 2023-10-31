import UserDetailForm from "./UserDetailForm";

const getUserDetail = async (id: string) => {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/detail/${id}`,
    { cache: "no-cache" }
  );
  const { data } = await req.json();
  return data;
};

const getRoles = async () => {
  const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/roles/list`);
  const { data } = await req.json();
  return data;
};

export default async function UserDetail({
  params: { id },
}: {
  params: { id: string };
}) {
  const userDetail = await getUserDetail(id);
  const roles = await getRoles();

  return <UserDetailForm userDetail={userDetail} roles={roles} />;
}
