"use client";
import { rolesConfig } from "@/lib/rolesConfig";
import ExportButton from "@/ui-components/ExportButton";
import SearchBar from "@/ui-components/SearchBar";
import { Button, Modal, Paper, Typography } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ExpiredReservations from "./ExpiredReservations";
import StatusSelect from "./StatusSelect";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  outline: "none",
  transform: "translate(-50%, -50%)",
  width: "80%",
};

export default function ResponsiveReservationFilters({
  userRole,
  statuses,
}: {
  userRole: any;
  statuses: any;
}) {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") === "true";
  const { replace } = useRouter();
  const pathname = usePathname();

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => replace(`${pathname}?filter=true`)}
      >
        Filtrovat
      </Button>
      <Modal
        open={filter}
        onClose={() => replace(`${pathname}?filter=false`)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={style} className="flex flex-col gap-3 p-2">
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
        </Paper>
      </Modal>
    </>
  );
}
