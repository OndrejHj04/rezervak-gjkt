import GroupDetailDisplay from "./GroupDetailDisplay";
import GroupDetailForm from "./GroupDetailForm";
import GroupDetailNavigation from "./GroupDetailNavigation";

const getGroupDetail = async (id: string, reservations: any, users: any) => {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/group/detail/${id}?reservations=${reservations}&users=${users}`,
    { cache: "no-cache" }
  );
  const { data } = await req.json();
  return data;
};

export default async function Page({
  params: { id },
  searchParams: { mode, reservations, users },
}: {
  params: { id: string };
  searchParams: { mode: string; reservations: string; users: string };
}) {
  const group = await getGroupDetail(id, reservations || 1, users || 1);
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
