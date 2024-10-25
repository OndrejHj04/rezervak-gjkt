"use client";
import { FormControl, FormHelperText, MenuItem, Select } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const roles = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Správce" },
  { id: 3, name: "Uživatel" },
  { id: 4, name: "Veřejnost" }
]

export default function RolesSelect() {
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
    <FormControl>
      <Select
        variant="standard"
        label="Role"
        renderValue={(data) => {
          const name = roles.find((status: any) => status.id === data);
          return <div>{name?.name || "Všechny"}</div>;
        }}
        defaultValue={status}
        onChange={handleChange}
      >
        <MenuItem value={0}>Všechny</MenuItem>
        {roles.map((status: any) => (
          <MenuItem key={status.id} value={status.id} className="gap-2">
            {status.name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>Role</FormHelperText>
    </FormControl>
  );
}
