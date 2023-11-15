"use client";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import MakeGroupRefetch from "./refetch";
import { useState } from "react";

export default function SearchBar() {
  const [text, setText] = useState("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const makeSearch = (e: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("search", text);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <TextField
      variant="outlined"
      label="Hledat skupiny"
      value={text}
      onChange={(e) => setText(e.target.value)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton disabled={!text.length} onClick={makeSearch}>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
