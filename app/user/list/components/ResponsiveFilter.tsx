"use client";
import { rolesConfig } from "@/rolesConfig";
import ExportButton from "@/ui-components/ExportButton";
import SearchBar from "@/ui-components/SearchBar";
import { Button, Modal, Paper, Typography } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import UserRolesSelect from "./RolesSelect";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  outline: "none",
  transform: "translate(-50%, -50%)",
  width: "80%",
};

export default function ResponsiveFilter({
  roles,
  userRole,
}: {
  roles: any;
  userRole: any;
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
          {rolesConfig.users.modules.userTable.config.topbar.search.includes(
            userRole
          ) && <SearchBar label="uživatele" />}
          {rolesConfig.users.modules.userTable.config.topbar.filter.includes(
            userRole
          ) && <UserRolesSelect roles={roles} />}
          {rolesConfig.users.modules.userTable.config.topbar.export.includes(
            userRole
          ) && <ExportButton prop="users" translate={"uživatelé"} />}
        </Paper>
      </Modal>
    </>
  );
}
