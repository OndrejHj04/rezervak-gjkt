"use client";

import { store } from "@/store/store";
import {
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FusionForm() {
  const searchParams = useSearchParams();
  const fuse = searchParams.get("fuse") === "true";
  const [checked, setChecked] = useState(fuse);
  const { replace } = useRouter();
  const pathname = usePathname();
  const { fusion } = store();
  const [firstRow, secondRow] = fusion;

  return (
    <div className="p-1 flex flex-col justify-start gap-2">
      <Typography className="text-xl">Fúze řádků</Typography>
      <TextField
        label="První řádek"
        value={firstRow?.name || ""}
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
      />
      <TextField
        label="Druhý řádek"
        value={secondRow?.name || ""}
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
      />
    </div>
  );
}
