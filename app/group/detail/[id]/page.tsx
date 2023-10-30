import GroupDetailForm from "./GroupDetailForm";

const getGroupDetail = async (id: string) => {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/group/detail/${id}`,
    { cache: "no-cache" }
  );
  const { data } = await req.json();
  return data;
};

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const group = await getGroupDetail(id);
  return <GroupDetailForm group={group} />;
}
