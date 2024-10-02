"use client";
import { FormControl, FormHelperText, Checkbox, ListItemText, MenuItem, Select } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ChangeTypeProperites } from "./changelog.types";
import { useEffect, useState } from "react";

export default function ChangeTypeSelect({ changeTypes }: { changeTypes: ChangeTypeProperites[] }) {
  const searchParams = useSearchParams();
  const status = searchParams.get("changeTypeId") || ""
  const { replace } = useRouter();
  const pathname = usePathname();

  const [values, setValues] = useState(status.length ? status.split(",") : changeTypes.map(({label})=>label))

  const handleChange = (label: ChangeTypeProperites["label"]) => {
    if (values.includes(label)) {
      setValues(v => v.filter(x => x !== label))
    } else {
      setValues(v => [...v, label])
    }
  };

  useEffect(() => {
    if (values.length) {
      const params = new URLSearchParams(searchParams);
      params.set("changeTypeId", values.toString());
      replace(`${pathname}?${params.toString()}`);
    }
  }, [values])

  return (
    <FormControl sx={{ width: 150 }}>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        variant="standard"
        label="Typ změny"
        renderValue={(data) => {
          console.log(data)
          return <div>{values.length === changeTypes.length ? "Všechny" : values.toString()}</div>;
        }}
        value={values}
      >
        {changeTypes.map((change, i) => (
          <MenuItem key={i} disabled={values.length < 2 && values.includes(change.label)} value={change.label} onClick={() => handleChange(change.label)} className="gap-2">
            <Checkbox checked={values.includes(change.label)} />
            <ListItemText>
              {change.icon} {change.label}
            </ListItemText>
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>Zobrazené změny</FormHelperText>
    </FormControl>
  );
}
