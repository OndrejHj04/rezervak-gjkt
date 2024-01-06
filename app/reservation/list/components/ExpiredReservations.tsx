"use client";
import { Checkbox, FormControlLabel } from "@mui/material";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function ExpiredReservations() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const pathname = usePathname();

  const { replace } = useRouter();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.set("type", type === "expired" ? "all" : "expired");
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <FormControlLabel
      control={<Checkbox onClick={handleClick} checked={type === "expired"} />}
      label="Pouze proběhlé rezervace"
    />
  );
}
