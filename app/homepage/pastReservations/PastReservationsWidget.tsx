import { Button, MenuList, Paper, Typography } from "@mui/material";
import ElderlyIcon from "@mui/icons-material/Elderly";
import SingleReservation from "../reservations/SingleReservation";
import { useSearchParams } from "next/navigation";
import MakeReservationsArchive from "./MakeReservationsArchive";
import fetcher from "@/lib/fetcher";
import TableListPagination from "@/ui-components/TableListPagination";

const getReservations = async (id: any, page: any) => {
  try {
    const data = await fetcher(
      `/api/reservations/list?not_status=1&limit=5&page=${page}&type=expired`
    );
    return data;
  } catch (e) {
    return [];
  }
};

export default async function PastReservationsWidget({
  user: { user },
  searchParams,
}: {
  user: { user: any };
  searchParams: any;
}) {
  const page = searchParams["archive"] || 1;
  const reservations = await getReservations(user.id, page);

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
