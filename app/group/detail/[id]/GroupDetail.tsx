import { Tab, Tabs } from "@mui/material";
import GroupDetailDisplay from "./GroupDetailDisplay";
import GroupDetailForm from "./GroupDetailForm";
import Link from "next/link";
import { rolesConfig } from "@/rolesConfig";

const getGroupDetail = async (id: string, reservations: any, users: any) => {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/group/detail/${id}?reservations=${reservations}&users=${users}`,
    { cache: "no-cache" }
  );
  const { data } = await req.json();
  return data;
};

export default async function GroupDetail({
  params,
  searchParams: { mode, reservations, users },
  userRole,
  userId,
}: {
  params: any;
  searchParams: { mode: string; reservations: string; users: string };
  userRole: any;
  userId: any;
}) {
  const group = await getGroupDetail(params, reservations || 1, users || 1);
  console.log(group);
  const isOwner = group.owner.id === userId;

  return (
    <>
      <div className="flex justify-between">
        <div>
          <Tabs aria-label="basic tabs example" value={mode === "edit" ? 1 : 0}>
            <Tab
              component={Link}
              href={`/group/detail/${params}?mode=view`}
              label="Zobrazit"
            />
            {(rolesConfig.groups.modules.groupsDetail.edit.includes(userRole) ||
              isOwner) && (
              <Tab
                component={Link}
                href={`/group/detail/${params}?mode=edit`}
                label="Editovat"
              />
            )}
          </Tabs>
        </div>
      </div>
      {mode === "edit" ? (
        <GroupDetailForm group={group} />
      ) : (
        <GroupDetailDisplay group={group} />
      )}
    </>
  );
}
