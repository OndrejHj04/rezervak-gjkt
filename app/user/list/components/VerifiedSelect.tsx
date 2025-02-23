"use client";

import { FormControl, FormHelperText, MenuItem, Select } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const options = [
  { id: 1, name: "Pouze ověření" },
  { id: 2, name: "Pouze neověření" },
];

export default function VerifiedSelect() {
  const searchParams = useSearchParams();
  const status = Number(searchParams.get("verified")) || 0;
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleChange = (e: any) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    params.set("verified", e.target.value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <FormControl>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        variant="standard"
        label="organization"
        renderValue={(data) => {
          const name = options.find((status: any) => status.id === data);
          return <div>{name?.name || "Všechny"}</div>;
        }}
        defaultValue={status}
        onChange={handleChange}
      >
        <MenuItem value={0}>Všechny</MenuItem>
        {options.map((status: any) => (
          <MenuItem key={status.id} value={status.id} className="gap-2">
            {status.name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>Ověření</FormHelperText>
    </FormControl>
  );
}
