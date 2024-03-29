import { Tab, Tabs } from "@mui/material";
import UserDetailDisplay from "./UserDetailDisplay";
import UserDetailForm from "./UserDetailForm";
import Link from "next/link";
import { rolesConfig } from "@/lib/rolesConfig";
import fetcher from "@/lib/fetcher";
import { getUserDetail } from "@/lib/api";

const getRoles = async () => {
  const { data } = await fetcher(`/api/roles/list`);
  return data;
};

export default async function UserDetail({
  params,
  searchParams: { mode, reservations, groups },
  userRole,
  userId,
}: {
  params: any;
  searchParams: { mode: any; reservations: any; groups: any };
  userRole: any;
  userId: any;
}) {
  const { data } = await getUserDetail({
    id: params,
    rpage: reservations || 1,
    gpage: groups || 1,
  });

  const roles = await getRoles();
  const selfAccount = Number(params) === userId;
  const selfEdit =
    rolesConfig.users.modules.userDetail.selfEdit.includes(userRole);

  const selfVisit =
    rolesConfig.users.modules.userDetail.visitSelf.includes(userRole);

  return (
    <>
      {data ? (
        <>
          <div className="flex justify-between">
            <div>
              <Tabs
                aria-label="basic tabs example"
                value={mode === "edit" ? 1 : 0}
              >
                {((selfAccount && selfVisit) ||
                  rolesConfig.users.modules.userDetail.visit.includes(
                    userRole
                  )) && (
                  <Tab
                    component={Link}
                    href={`/user/detail/${params}?mode=view`}
                    label="Zobrazit"
                  />
                )}
                {((selfAccount && selfEdit) ||
                  rolesConfig.users.modules.userDetail.edit.includes(
                    userRole
                  )) && (
                  <Tab
                    component={Link}
                    href={`/user/detail/${params}?mode=edit`}
                    label="Editovat"
                  />
                )}
              </Tabs>
            </div>
          </div>
          {mode === "edit" ? (
            <UserDetailForm
              userDetail={data}
              roles={roles}
              userRole={userRole}
            />
          ) : (
            <UserDetailDisplay userDetail={data} />
          )}
        </>
      ) : (
        <div>Nenalezeno</div>
      )}
    </>
  );
}
