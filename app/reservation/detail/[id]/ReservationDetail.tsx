import ReservationDetailForm from "./ReservationDetailForm";
import { Reservation, ReservationStatus } from "@/types";
import ReservationDetailDisplay from "./ReservationDetailDisplay";
import { Tab, Tabs } from "@mui/material";
import Link from "next/link";
import { rolesConfig } from "@/lib/rolesConfig";
import fetcher from "@/lib/fetcher";

const getReservation = async (id: string, users: any, groups: any) => {
  const { data } = await fetcher(
    `/api/reservations/detail/${id}?users=${users}&groups=${groups}`,
    { cache: "no-cache" }
  );

  return data;
};

const getReservationStatus = async () => {
  const { data } = await fetcher(`/api/reservations/status?type=limit`);

  return data;
};

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
  const reservation = (await getReservation(
    params,
    users || 1,
    groups || 1
  )) as Reservation;
  const reservationStatus =
    (await getReservationStatus()) as ReservationStatus[];

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
