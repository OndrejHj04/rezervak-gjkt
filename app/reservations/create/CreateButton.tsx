"use client";

import { store } from "@/store/store";
import { Button } from "@mui/material";
import * as _ from "lodash";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ReservationListMakeRefetch from "../list/refetch";
import { NewReservation } from "@/types";

export default function CreateButton() {
  const { createReservation, setCreateReservation } = store();

  const setDefault = () => {
    setCreateReservation({
      from_date: "",
      to_date: "",
      groups: [],
      members: [],
      rooms: 0,
      leader: 0,
      purpouse: "",
      instructions: "",
      name: "",
    });
  };
  const handleSubmit = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations/create`, {
      method: "POST",
      body: JSON.stringify(createReservation),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Rezervace úspěšně vytvořena");
        ReservationListMakeRefetch("/reservations/list");
        setDefault();
      })
      .catch(() => {
        toast.error("Něco se nepovedlo");
      });
  };

  return (
    <Button
      variant="outlined"
      type="submit"
      onClick={handleSubmit}
      disabled={
        !Object.keys(createReservation).every((value: any) => {
          const data = createReservation[value as keyof NewReservation];
          if (value !== "groups" && Array.isArray(data)) {
            return data.length > 0;
          }
          return Boolean(data);
        })
      }
    >
      Uložit
    </Button>
  );
}
