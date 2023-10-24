"use client";

import { store } from "@/store/store";
import { Button } from "@mui/material";
import * as _ from "lodash";

export default function CreateButton() {
  const { createReservation } = store();

  const handleSubmit = () => {
    console.log("submit");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations/create`, {
      method: "POST",
      body: JSON.stringify(createReservation),
    });
  };

  return (
    <Button
      variant="outlined"
      type="submit"
      onClick={handleSubmit}
      disabled={
        !Object.values(createReservation).every((value: any) => {
          if (Array.isArray(value)) {
            return value.length > 0;
          }
          return Boolean(value);
        })
      }
    >
      Uložit
    </Button>
  );
}
