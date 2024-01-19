"use client";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";

export default function SearchBar({ label }: { label: any }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const search = searchParams.get("search") || "";

  const makeSearch = (value: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("search", value);
    replace(`${pathname}?${params.toString()}`);
  };

  const removeFilter = () => {
    replace(`${pathname}`);
  };

  return (
    <div className="flex items-center gap-2">
      <TextField
        variant="outlined"
        label={`Hledat ${label}...`}
        value={search}
        onChange={(e) => makeSearch(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                color="error"
                disabled={!search}
                onClick={removeFilter}
              >
                <CancelIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}
