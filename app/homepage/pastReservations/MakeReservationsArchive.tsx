"use client";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import HomepageRefetch from "../refetch";

export default function MakeReservationsArchive({
  disabled,
}: {
  disabled: any;
}) {
  const handleClick = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations/make-archive`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Rezervace úspěšně archivovány");
      });
    HomepageRefetch();
  };
  return (
    <Button
      variant="contained"
      disabled={disabled}
      className="mt-auto"
      onClick={handleClick}
    >
      Archivovat rezervace
    </Button>
  );
}
