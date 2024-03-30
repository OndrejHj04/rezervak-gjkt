import fetcher from "@/lib/fetcher";
import { rolesConfig } from "@/lib/rolesConfig";
import ExportButton from "@/ui-components/ExportButton";
import UserRolesSelect from "./RolesSelect";
import SearchBar from "@/ui-components/SearchBar";
import ResponsiveFilter from "./ResponsiveFilter";
import { getRolesList } from "@/lib/api";

export default async function UserListFilter({ userRole }: { userRole: any }) {
  const { data: roles } = await getRolesList({ filter: false });

  return (
    <>
      <div className="gap-3 justify-end sm:flex hidden">
        {rolesConfig.users.modules.userTable.config.topbar.search.includes(
          userRole
        ) && <SearchBar label="uživatele" />}
        {rolesConfig.users.modules.userTable.config.topbar.filter.includes(
          userRole
        ) && <UserRolesSelect roles={roles} />}
        {rolesConfig.users.modules.userTable.config.topbar.export.includes(
          userRole
        ) && <ExportButton prop="users" translate={"uživatelé"} />}
      </div>
      <div className="sm:hidden flex justify-end">
        <ResponsiveFilter roles={roles} userRole={userRole} />
      </div>
    </>
  );
}
