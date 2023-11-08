"use client";

import { store } from "@/store/store";
import {
  FormControl,
  FormHelperText,
  Icon,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { revalidatePath } from "next/cache";
import { redirect, useRouter, useSearchParams } from "next/navigation";

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
