"use client";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import MakeGroupRefetch from "./refetch";

export default function SearchBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const search = searchParams.get("search") || "";

  const makeSearch = (e: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("search", e.target.value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <TextField
      variant="outlined"    
      label="Hledat skupiny"
      value={search}
      onChange={makeSearch}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}
