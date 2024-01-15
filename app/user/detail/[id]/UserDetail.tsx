import { Tab, Tabs } from "@mui/material";
import UserDetailDisplay from "./UserDetailDisplay";
import UserDetailForm from "./UserDetailForm";
import Link from "next/link";
import { rolesConfig } from "@/rolesConfig";

const getUserDetail = async (id: string, reservations: any, groups: any) => {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/detail/${id}?reservations=${reservations}&groups=${groups}`,
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
  const userDetail = await getUserDetail(
    params,
    reservations || 1,
    groups || 1
  );
  const roles = await getRoles();
  const selfAccount = Number(params) === userId;
  const selfEdit =
    rolesConfig.users.modules.userDetail.selfEdit.includes(userRole);

  const selfVisit =
    rolesConfig.users.modules.userDetail.visitSelf.includes(userRole);

  return (
    <>
      {userDetail ? (
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
              userDetail={userDetail}
              roles={roles}
              userRole={userRole}
            />
          ) : (
            <UserDetailDisplay userDetail={userDetail} />
          )}
        </>
      ) : (
        <div>Nenalezeno</div>
      )}
    </>
  );
}
