import UserDetailDisplay from "./UserDetailDisplay";
import UserDetailForm from "./UserDetailForm";
import UserDetailNavigation from "./UserDetailNavigation";

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
  searchParams: { mode },
}: {
  params: { id: string };
  searchParams: { mode: any; users: any; groups: any };
}) {
  const userDetail = await getUserDetail(id);
  const roles = await getRoles();

  return (
    <>
      <UserDetailNavigation id={id} mode={mode} />
      {mode === "edit" ? (
        <UserDetailForm userDetail={userDetail} roles={roles} />
      ) : (
        <UserDetailDisplay userDetail={userDetail} />
      )}
    </>
  );
}
