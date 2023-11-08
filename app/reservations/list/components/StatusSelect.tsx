"use client";

import { store } from "@/store/store";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

export default function StatusSelect({ statuses }: { statuses: any }) {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const status = Number(searchParams.get("status")) || 0;

  const handleChange = (e: any) => {
    const page = searchParams.get("page");
    if (page) {
      push(`/reservations/list/?page=${page}&status=${e.target.value}`);
    } else {
      push(`/reservations/list/?status=${e.target.value}`);
    }
  };

  return (
    <FormControl sx={{ width: 150 }}>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        variant="standard"
        label="Status rezervace"
        value={status}
        onChange={handleChange}
      >
        <MenuItem value={0}>Všechny</MenuItem>
        {statuses.map((status: any) => (
          <MenuItem key={status.id} value={status.id}>
            {status.display_name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>Status rezervace</FormHelperText>
    </FormControl>
  );
}
