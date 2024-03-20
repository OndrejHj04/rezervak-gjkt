import SearchBar from "@/ui-components/SearchBar";
import ExportButton from "@/ui-components/ExportButton";
import { rolesConfig } from "@/lib/rolesConfig";
import ResponsiveGroupsFilter from "./ResponsiveGroupsFilter";

export default function GroupListFilter({ userRole }: { userRole: any }) {
  return (
    <>
      <div className="gap-3 justify-end sm:flex hidden">
        {rolesConfig.groups.modules.groupsTable.config.topbar.search.includes(
          userRole
        ) && <SearchBar label={"skupiny"} />}
        {rolesConfig.groups.modules.groupsTable.config.topbar.export.includes(
          userRole
        ) && <ExportButton prop={"group"} translate={"skupiny"} />}
      </div>
      <div className="sm:hidden flex justify-end">
        <ResponsiveGroupsFilter userRole={userRole} />
      </div>
    </>
  );
}
