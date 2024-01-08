"use client";
import { Chip, TableCell } from "@mui/material";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReservationTableSort() {
  const searchParams = useSearchParams();
  const dir = searchParams.get("dir");
  const column = searchParams.get("col");
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();

  const makeSwitch = () => {
    dir === null && params.set("dir", "asc");
    dir === "asc" && params.set("dir", "desc");
    if (dir === "desc") {
      params.delete("dir");
      params.delete("col");
    }
  };

  const makeSort = (string: any) => {
    if (column === string) {
      makeSwitch();
    } else {
      params.set("dir", "asc");
      params.set("col", string);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const renderIcon = (name: string) => {
    if (column === name) {
      if (dir === "desc") return <ArrowDownwardIcon />;
      if (dir === "asc") return <ArrowUpwardIcon />;
    } else {
      return <ArrowUpwardIcon sx={{ opacity: 0.3 }} />;
    }
  };

  return (
    <>
      <TableCell sx={{ padding: 1.5 }}>
        <Chip
          onClick={() => makeSort("from_date")}
          label="Začátek"
          icon={renderIcon("from_date")}
        />
      </TableCell>
      <TableCell sx={{ padding: 1.5 }}>
        <Chip
          onClick={() => makeSort("to_date")}
          label="Konec"
          icon={renderIcon("to_date")}
        />
      </TableCell>
    </>
  );
}
