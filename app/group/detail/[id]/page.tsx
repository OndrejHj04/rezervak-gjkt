import GroupDetailDisplay from "./GroupDetailDisplay";
import GroupDetailForm from "./GroupDetailForm";
import GroupDetailNavigation from "./GroupDetailNavigation";

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
  searchParams: { mode },
}: {
  params: { id: string };
  searchParams: { mode: string };
}) {
  const group = await getGroupDetail(id);
  return (
    <>
      <GroupDetailNavigation id={id} mode={mode} />
      {mode === "edit" ? (
        <GroupDetailForm group={group} />
      ) : (
        <GroupDetailDisplay group={group} />
      )}
    </>
  );
}
