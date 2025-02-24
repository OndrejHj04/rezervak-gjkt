"use client";
import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
} from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export const options = [
  { id: 1, displayName: "Běží" },
  { id: 2, displayName: "Nespuštěná" },
];

export default function RegistrationState({ className }: { className?: any }) {
  const searchParams = useSearchParams();
  const status = Number(searchParams.get("registration")) || 0;
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleChange = (e: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("registration", e.target.value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <FormControl className={className}>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        variant="standard"
        label="Status rezervace"
        renderValue={(data) => {
          const name = options.find((status: any) => status.id === data);
          return <div>{name?.displayName || "Vše"}</div>;
        }}
        defaultValue={status}
        onChange={handleChange}
      >
        <MenuItem value={0}>Vše</MenuItem>
        {options.map((status: any) => (
          <MenuItem key={status.id} value={status.id}>
            {status.displayName}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>Stav registrace</FormHelperText>
    </FormControl>
  );
}
