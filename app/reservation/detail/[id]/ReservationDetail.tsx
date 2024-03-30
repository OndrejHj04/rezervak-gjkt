import ReservationDetailForm from "./ReservationDetailForm";
import { Reservation, ReservationStatus } from "@/types";
import ReservationDetailDisplay from "./ReservationDetailDisplay";
import { Tab, Tabs } from "@mui/material";
import Link from "next/link";
import { rolesConfig } from "@/lib/rolesConfig";
import fetcher from "@/lib/fetcher";
import { getReservationDetail, getReservationsStatus } from "@/lib/api";

export default async function ReservationDetail({
  params,
  searchParams: { mode, users, groups },
  userId,
  userRole,
}: {
  params: any;
  searchParams: { mode: any; users: any; groups: any };
  userId: any;
  userRole: any;
}) {
  const { data: reservation } = (await getReservationDetail({
    id: params,
    upage: users || 1,
    gpage: groups || 1,
  })) as any;

  const reservationStatus = (await getReservationsStatus({
    filter: true,
  })) as any;

  const isLeader = reservation.leader.id === userId;
  const archived = reservation.status.id === 1;
  return (
    <>
      <div className="flex justify-between">
        <div>
          <Tabs aria-label="basic tabs example" value={mode === "edit" ? 1 : 0}>
            <Tab
              component={Link}
              href={`/reservation/detail/${params}?mode=view`}
              label="Zobrazit"
            />
            {!archived &&
              (rolesConfig.reservations.modules.reservationsDetail.edit.includes(
                userRole
              ) ||
                isLeader) && (
                <Tab
                  component={Link}
                  href={`/reservation/detail/${params}?mode=edit`}
                  label="Editovat"
                />
              )}
          </Tabs>
        </div>
      </div>
      {mode === "edit" ? (
        <ReservationDetailForm
          reservation={reservation}
          reservationStatus={reservationStatus}
        />
      ) : (
        <ReservationDetailDisplay
          reservation={reservation}
          users={users}
          groups={groups}
        />
      )}
    </>
  );
}
