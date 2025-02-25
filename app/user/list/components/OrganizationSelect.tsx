"use client";
import { FormControl, FormHelperText, MenuItem, Select } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const organizations = [
  { id: 1, name: "ZO" },
  { id: 2, name: "Zaměstnanec" },
  { id: 3, name: "Veřejnost" },
];

export default function OrganizationSelect() {
  const searchParams = useSearchParams();
  const status = Number(searchParams.get("organization")) || 0;
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleChange = (e: any) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    params.set("organization", e.target.value);
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
          const name = organizations.find((status: any) => status.id === data);
          return <div>{name?.name || "Všechny"}</div>;
        }}
        defaultValue={status}
        onChange={handleChange}
      >
        <MenuItem value={0}>Všechny</MenuItem>
        {organizations.map((status: any) => (
          <MenuItem key={status.id} value={status.id} className="gap-2">
            {status.name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>Organizace</FormHelperText>
    </FormControl>
  );
}
