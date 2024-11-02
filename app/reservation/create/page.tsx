import React from "react";
import ReservationDates from "./components/ReservationDates/ReservationDates";
import ReservationMembers from "./components/ReservationMembers/ReservationMembers";
import ReservationDetail from "./components/ReservationDetail/ReservationDetail";

export default async function CreateReservation() {

  return (
    <React.Fragment>
      <ReservationDates />
      <ReservationMembers />
      <ReservationDetail />
    </React.Fragment>
  )
}
