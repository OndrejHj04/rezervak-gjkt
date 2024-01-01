"use client";
import { FormControl, FormHelperText, MenuItem, Select } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function RolesSelect({ roles }: { roles: any }) {
  const searchParams = useSearchParams();
  const status = Number(searchParams.get("role")) || 0;
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleChange = (e: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("role", e.target.value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <FormControl sx={{ width: 150 }}>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        variant="standard"
        label="Role uživatele"
        renderValue={(data) => {
          const name = roles.find((status: any) => status.id === data);
          return <div>{name?.name || "Všechny"}</div>;
        }}
        value={status}
        onChange={handleChange}
      >
        <MenuItem value={0}>Všechny</MenuItem>
        {roles.map((status: any) => (
          <MenuItem key={status.id} value={status.id} className="gap-2">
            {status.name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>Role uživatele</FormHelperText>
    </FormControl>
  );
}
