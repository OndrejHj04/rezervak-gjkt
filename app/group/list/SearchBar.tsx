"use client";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const [text, setText] = useState("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const search = searchParams.get("search");

  const makeSearch = (e: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("search", text);
    replace(`${pathname}?${params.toString()}`);
  };

  const removeFilter = () => {
    setText("");
    replace(`${pathname}`);
  };

  return (
    <div className="flex items-center gap-2">
      <TextField
        variant="outlined"
        label="Hledat skupiny"
        value={text}
        onChange={(e) => setText(e.target.value)}
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
      <IconButton color="info" disabled={text === search} onClick={makeSearch}>
        <SearchIcon />
      </IconButton>
    </div>
  );
}
