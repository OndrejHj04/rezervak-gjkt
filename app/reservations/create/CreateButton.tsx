"use client";

import { store } from "@/store/store";
import { Button } from "@mui/material";
import * as _ from "lodash";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CreateButton() {
  const { createReservation } = store();
  const { push } = useRouter();
  const handleSubmit = () => {
    console.log("submit");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations/create`, {
      method: "POST",
      body: JSON.stringify(createReservation),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Rezervace úspěšně vytvořena");
        push("/");
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
