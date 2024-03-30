"use client";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import HomepageRefetch from "../refetch";
import { setReservationsArchive } from "@/lib/api";

export default function MakeReservationsArchive({
  disabled,
}: {
  disabled: any;
}) {
  const handleClick = () => {
    setReservationsArchive().then(({ count }) => {
      toast.success(`${count} rezervací úspěšně archivováno`);
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
