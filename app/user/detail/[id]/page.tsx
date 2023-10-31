import UserDetailForm from "./UserDetailForm";

const getUserDetail = async (id: string) => {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/detail/${id}`
  );
  const { data } = await req.json();
  return data;
};

export default async function UserDetail({
  params: { id },
}: {
  params: { id: string };
}) {
  const userDetail = await getUserDetail(id);

  return <UserDetailForm userDetail={userDetail}/>;
}
