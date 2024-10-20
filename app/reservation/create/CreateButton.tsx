"use client";

import { store } from "@/store/store";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import ReservationListMakeRefetch from "../list/refetch";
import { useState } from "react";
import { createNewReservation } from "@/lib/api";

export default function CreateButton() {
  const { createReservation, setCreateReservation } = store();
  const [loading, setLoading] = useState(false);
  const setDefault = () => {
    setCreateReservation({
      from_date: "",
      to_date: "",
      groups: [],
      members: [],
      rooms: [],
      leader: 0,
      purpouse: "",
      instructions: "",
      name: "",
    });
  };
  const handleSubmit = () => {
    setLoading(true);
    createNewReservation({ ...createReservation }).then(({ success }) => {
      if (success) {
        toast.success("Rezervace úspěšně vytvořena");
        ReservationListMakeRefetch();
        setDefault();
      } else toast.error("Něco se nepovedlo");
    });
  };

  return (
    <Button
      variant="outlined"
      type="submit"
      onClick={handleSubmit}
      disabled={
        !Object.keys(createReservation).every((value: any) => {
          if (value !== "groups" && Array.isArray(createReservation)) {
            return createReservation.length > 0;
          }
          return value === "instructions" ? true : Boolean(createReservation);
        }) || loading
      }
    >
      Uložit
    </Button>
  );
}
