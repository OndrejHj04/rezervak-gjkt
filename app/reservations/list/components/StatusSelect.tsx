"use client";

import {
  FormControl,
  FormHelperText,
  Icon,
  MenuItem,
  Select,
} from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function StatusSelect({ statuses }: { statuses: any }) {
  const searchParams = useSearchParams();
  const status = Number(searchParams.get("status")) || 0;
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleChange = (e: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("status", e.target.value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <FormControl sx={{ width: 150 }}>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        variant="standard"
        label="Status rezervace"
        renderValue={(data) => {
          const name = statuses.find((status: any) => status.id === data);
          return <div>{name?.display_name || "Všechny"}</div>;
        }}
        value={status}
        onChange={handleChange}
      >
        <MenuItem value={0}>Všechny</MenuItem>
        {statuses.map((status: any) => (
          <MenuItem key={status.id} value={status.id} className="gap-2">
            <Icon sx={{ "&&": { color: status.color } }}>{status.icon}</Icon>
            {status.display_name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>Status rezervace</FormHelperText>
    </FormControl>
  );
}
