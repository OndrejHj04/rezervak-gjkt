import React from "react";
import ReservationDates from "./components/ReservationDates/ReservationDates";
import ReservationMembers from "./components/ReservationMembers/ReservationMembers";
import ReservationDetail from "./components/ReservationDetail/ReservationDetail";

export default async function CreateReservation({ searchParams }: { searchParams: any }) {
  const { userSearch } = searchParams
  return (
    <React.Fragment>
      <ReservationDates />
      <ReservationMembers />
      <ReservationDetail userSearch={userSearch} />
    </React.Fragment>
  )
}
