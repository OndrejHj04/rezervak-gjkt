"use client";

import { DoDisturb, DoneAll, FolderDelete, GppBad, Grid4x4Rounded, RunningWithErrors } from "@mui/icons-material";
import {
  FormControl,
  FormHelperText,
  Icon,
  MenuItem,
  Select,
} from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";


const statuses = [
  { id: 1, color: "#999999", displayName: "Archiv", icon: <FolderDelete /> },
  { id: 2, color: "#FCD34D", displayName: "Čeká na potvrzení", icon: <RunningWithErrors /> },
  { id: 3, color: "#34D399", displayName: "Potvrzeno", icon: <DoneAll /> },
  { id: 4, color: "#ED9191", displayName: "Zamítnuto", icon: <GppBad /> },
  { id: 5, color: "#ED9191", displayName: "Blokováno správcem", icon: <DoDisturb /> },
]

export default function StatusSelect({ className }: { className?: any }) {
  const searchParams = useSearchParams();
  const status = Number(searchParams.get("status")) || 0;
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleChange = (e: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("status", e.target.value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <FormControl className={className}>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        variant="standard"
        label="Status rezervace"
        renderValue={(data) => {
          const name = statuses.find((status: any) => status.id === data);
          return <div>{name?.displayName || "Všechny"}</div>;
        }}
        defaultValue={status}
        onChange={handleChange}
      >
        <MenuItem value={0}>Všechny</MenuItem>
        {statuses.map((status: any) => (
          <MenuItem key={status.id} value={status.id} className="gap-2">
            <Icon sx={{ "&&": { color: status.color } }}>{status.icon}</Icon>
            {status.displayName}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>Status rezervace</FormHelperText>
    </FormControl>
  );
}
