"use client";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import HomepageRefetch from "../refetch";
import fetcher from "@/lib/fetcher";

export default function MakeReservationsArchive({
  disabled,
}: {
  disabled: any;
}) {
  const handleClick = () => {
    fetcher(
      `/api/reservations/make-archive`,
      {
        method: "POST",
      }
    )
      .then((data) => {
        toast.success("Rezervace úspěšně archivovány");
      });
    HomepageRefetch();
  };
  return (
    <Button
      variant="contained"
      disabled={disabled}
      className="w-full"
      onClick={handleClick}
    >
      Archivovat rezervace
    </Button>
  );
}
