import { Tab, Tabs } from "@mui/material";
import UserDetailDisplay from "./UserDetailDisplay";
import UserDetailForm from "./UserDetailForm";
import Link from "next/link";
import { getRolesList, getUserDetail } from "@/lib/api";

export default async function UserDetail({
  params,
  searchParams: { mode, reservations, groups, children },
  userRole,
}: {
  params: any;
  searchParams: { mode: any; reservations: any; groups: any; children: any };
  userRole: any;
}) {
  const { data } = await getUserDetail({
    id: params,
    rpage: reservations || 1,
    gpage: groups || 1,
    chpage: children || 1,
  });

  const { data: roles } = (await getRolesList()) as any;

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
                <Tab
                  component={Link}
                  href={`/user/detail/${params}?mode=view`}
                  label="Zobrazit"
                />
                <Tab
                  component={Link}
                  href={`/user/detail/${params}?mode=edit`}
                  label="Editovat"
                />
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
