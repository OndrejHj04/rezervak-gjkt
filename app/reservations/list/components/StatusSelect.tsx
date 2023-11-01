"use client";

import { store } from "@/store/store";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

export default function StatusSelect({ statuses }: { statuses: any }) {
  const { reservationsStatus, setReservationStatus } = store();

  return (
    <FormControl sx={{ width: 150 }}>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        variant="standard"
        label="Status rezervace"
        value={reservationsStatus}
        onChange={(e: any) => setReservationStatus(e.target.value)}
      >
        <MenuItem value={0}>Všechny</MenuItem>
        {statuses.map((status: any) => (
          <MenuItem key={status.id + 1} value={status.id + 1}>
            {status.display_name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>Status rezervace</FormHelperText>
    </FormControl>
  );
}
