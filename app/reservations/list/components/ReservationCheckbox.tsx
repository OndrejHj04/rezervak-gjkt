"use client";
import { store } from "@/store/store";
import { Checkbox } from "@mui/material";

export default function ReservationCheckbox({ id }: { id: any }) {
  const { selectedReservations, setSelectedReservations } = store();

  const handleSelect = (e: any) => {
    e.stopPropagation();
    if (selectedReservations.includes(id)) {
      setSelectedReservations(selectedReservations.filter((id) => id !== id));
    } else {
      setSelectedReservations([...selectedReservations, id]);
    }
  };

  return (
    <Checkbox
      checked={selectedReservations.includes(id)}
      onClick={handleSelect}
    />
  );
}
