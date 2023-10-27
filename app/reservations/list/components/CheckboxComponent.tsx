"use client";
import { store } from "@/store/store";
import { Reservation } from "@/types";
import { Checkbox } from "@mui/material";

export default function CheckboxComponent({
  reservations,
}: {
  reservations: Reservation[];
}) {
  const { selectedReservations, setSelectedReservations } = store();

  const handleSelected = () => {
    if (selectedReservations.length === reservations.length) {
      setSelectedReservations([]);
    } else {
      setSelectedReservations(reservations.map((user) => user.id));
    }
  };
  return (
    <Checkbox
      onClick={handleSelected}
      checked={
        selectedReservations.length === reservations.length &&
        Boolean(reservations.length)
      }
    />
  );
}
