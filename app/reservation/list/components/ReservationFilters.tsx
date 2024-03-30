import { rolesConfig } from "@/lib/rolesConfig";
import SearchBar from "@/ui-components/SearchBar";
import ExpiredReservations from "./ExpiredReservations";
import StatusSelect from "./StatusSelect";
import ExportButton from "@/ui-components/ExportButton";
import ResponsiveReservationFilters from "./ResponsiveReservationFilters";
import { getReservationsStatus } from "@/lib/api";

export default async function ReservationFilters({
  userRole,
}: {
  userRole: any;
}) {
  const statuses  = await getReservationsStatus({ filter: false });
  return (
    <>
      <div className="sm:flex gap-3 justify-end hidden">
        {rolesConfig.reservations.modules.reservationsTable.config.topbar.search.includes(
          userRole
        ) && <SearchBar label={"rezervace"} />}
        {rolesConfig.reservations.modules.reservationsTable.config.topbar.filter.includes(
          userRole
        ) && (
          <>
            <ExpiredReservations />
            <StatusSelect statuses={statuses} />
          </>
        )}
        {rolesConfig.reservations.modules.reservationsTable.config.topbar.export.includes(
          userRole
        ) && <ExportButton prop={"reservations"} translate={"rezervace"} />}
      </div>
      <div className="sm:hidden flex justify-end">
        <ResponsiveReservationFilters userRole={userRole} statuses={statuses} />
      </div>
    </>
  );
}
