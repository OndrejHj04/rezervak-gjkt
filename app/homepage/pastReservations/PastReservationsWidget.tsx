import { MenuList, Paper, Typography } from "@mui/material";
import ElderlyIcon from "@mui/icons-material/Elderly";
import SingleReservation from "../reservations/SingleReservation";
import MakeReservationsArchive from "./MakeReservationsArchive";
import TableListPagination from "@/ui-components/TableListPagination";
import { getReservationList } from "@/lib/api";

export default async function PastReservationsWidget({
  searchParams,
}: {
  searchParams: any;
}) {
  const page = searchParams["archive"] || 1;
  const reservations = await getReservationList({
    page,
    notStatus: [1, 5],
    limit: 5,
    type: "expired",
  });

  return (
    <Paper className="p-2 flex flex-col">
      <div className="flex justify-between items-center gap-3">
        <ElderlyIcon color="primary" />
        <Typography variant="h5" className="text-center">
          Uskutečněné rezervace
        </Typography>
        <ElderlyIcon color="primary" />
      </div>
      <MenuList>
        {reservations.data.length ? (
          reservations.data.map((reservation: any) => (
            <SingleReservation
              key={reservation.id}
              reservations={reservation}
            />
          ))
        ) : (
          <Typography className="text-center">
            Všechny uskutečněné rezervace mají stav {"archiv"}
          </Typography>
        )}
      </MenuList>
      <div className="mt-auto">
        <TableListPagination
          rpp={5}
          count={reservations.count || 0}
          name="archive"
        />
        <MakeReservationsArchive disabled={!reservations.data.length} />
      </div>
    </Paper>
  );
}
