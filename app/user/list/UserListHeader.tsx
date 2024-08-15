import { rolesConfig } from "@/lib/rolesConfig";
import { Chip, TableCell, TableHead, TableRow } from "@mui/material";
import RemoveUser from "./components/removeUser";

const columns = {
  name: "Jméno",
  email: "Email",
  role: "Role",
  birth_date: "Datum narození",
  verified: "Ověřený účet",
  organization: "Organizace",
};

export default function UserListHeader({ userRole }: { userRole: any }) {
  return (
    <TableHead>
      <TableRow>
        <TableCell />
        {rolesConfig.users.modules.userTable.config.delete.includes(
          userRole
        ) && (
          <>
            <TableCell>
              <RemoveUser />
            </TableCell>
          </>
        )}
        <TableCell />
        {(
          rolesConfig.users.modules.userTable.columns[userRole as never] as any
        ).map((item: any) => (
          <TableCell sx={{ padding: 1.5 }} key={columns[item as never]}>
            <Chip label={columns[item as never]} />
          </TableCell>
        ))}
        <TableCell />
      </TableRow>
    </TableHead>
  );
}
