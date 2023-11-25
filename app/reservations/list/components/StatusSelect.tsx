"use client";

import { store } from "@/store/store";
import {
  FormControl,
  FormHelperText,
  Icon,
  MenuItem,
  Select,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import ReservationListMakeRefetch from "../refetch";

export default function StatusSelect({ statuses }: { statuses: any }) {
  const { setReservationsLoading } = store();
  const searchParams = useSearchParams();
  const status = Number(searchParams.get("status")) || 0;

  const handleChange = (e: any) => {
    setReservationsLoading(true);
    const page = searchParams.get("page");
    if (page) {
      ReservationListMakeRefetch(
        `/reservations/list/?page=${page}&status=${e.target.value}`
      ).then(() => setReservationsLoading(false));
    } else {
      ReservationListMakeRefetch(
        `/reservations/list/?status=${e.target.value}`
      ).then((res) => setReservationsLoading(false));
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
