import {
  getUserList,
  getUsersAvaliableGroups,
  getUsersAvaliableReservations,
} from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import UserListItem from "./components/UserListItem";
import TableListPagination from "@/ui-components/TableListPagination";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import SortableColumn from "@/app/libComponents/SortableColumn";

const columns = [
  "children",
  "name",
  "email",
  "role",
  "organization",
  "verified",
  "detail",
];

export default async function UserListConfig({
  searchParams,
}: {
  searchParams: any;
}) {
  const {
    page,
    search,
    role,
    organization,
    verified,
    sort = "",
    dir = "",
  } = searchParams;
  const { user: currentUser } = (await getServerSession(authOptions)) as any;
  const isAdmin = currentUser.role.id !== 3;

  const { data, count } = await getUserList({
    page: page || 1,
    search: search || "",
    role: Number(role) || 0,
    organization: Number(organization) || 0,
    verified: Number(verified) || 0,
    sort,
    dir,
  });

  const { groups: avaliableGroups } = await getUsersAvaliableGroups(
    currentUser.id
  );
  const { reservations: avaliableReservations } =
    await getUsersAvaliableReservations(currentUser.id);

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow className="[&_.MuiTableCell-root]:font-semibold [&_.MuiTableCell-root]:text-lg">
            <TableCell />
            <SortableColumn id="u.first_name">Jméno</SortableColumn>
            <SortableColumn id="u.email">Email</SortableColumn>
            {isAdmin && <SortableColumn id="u.role">Role</SortableColumn>}
            {isAdmin && (
              <SortableColumn id="u.organization">Organizace</SortableColumn>
            )}
            {isAdmin && (
              <SortableColumn id="u.verified">Ověření</SortableColumn>
            )}
            <TableCell padding="none">
              <TableListPagination count={count} name={"page"} rpp={10} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((user: any) => (
            <UserListItem
              key={user.id}
              user={user}
              childrenData={user.children}
              avaliableGroups={avaliableGroups}
              avaliableReservations={avaliableReservations}
              isAdmin={isAdmin}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
