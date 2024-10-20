import React from "react";
import ReservationDates from "./components/ReservationDates/ReservationDates";
import ReservationMembers from "./components/ReservationMembers/ReservationMembers";
import ReservationDetail from "./components/ReservationDetail/ReservationDetail";

export default async function CreateReservation({
  searchParams,
}: {
  searchParams: any;
}) {
  const { users, groups, upage, gpage } = searchParams
  return (
    <React.Fragment>
      <ReservationDates />
      <ReservationMembers
        users={users || ""}
        groups={groups || ""}
        upage={upage}
        gpage={gpage}
      />
      <ReservationDetail />
    </React.Fragment>
  )
}
