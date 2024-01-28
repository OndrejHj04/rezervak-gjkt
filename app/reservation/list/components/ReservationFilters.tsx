import { rolesConfig } from "@/rolesConfig";
import SearchBar from "@/ui-components/SearchBar";
import ExpiredReservations from "./ExpiredReservations";
import StatusSelect from "./StatusSelect";
import ExportButton from "@/ui-components/ExportButton";
import fetcher from "@/lib/fetcher";
import ResponsiveReservationFilters from "./ResponsiveReservationFilters";

const getStatuses = async () => {
  try {
    const { data } = await fetcher(`/api/reservations/status?type=all`);
    return data;
  } catch (e) {
    return [];
  }
};
export default async function ReservationFilters({
  userRole,
}: {
  userRole: any;
}) {
  const statuses = await getStatuses();
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
