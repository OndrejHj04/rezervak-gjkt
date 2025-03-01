"use client";

import {
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FusionForm() {
  const searchParams = useSearchParams();
  const fuse = searchParams.get("fuse") === "true";
  const [checked, setChecked] = useState(fuse);
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleCheck = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set("fuse", `${e.target.checked}`);
    replace(`${pathname}?${params.toString()}`);
    setChecked(e.target.checked);
  };

  return (
    <div className="p-1 flex flex-col justify-start gap-2">
      <FormControlLabel
        className="mr-auto"
        labelPlacement="start"
        checked={checked}
        onChange={handleCheck}
        control={<Checkbox />}
        label={<Typography>Fúze řádků</Typography>}
      />
      <TextField
        label="První řádek"
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
      />
      <TextField
        label="Druhý řádek"
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
      />
    </div>
  );
}
