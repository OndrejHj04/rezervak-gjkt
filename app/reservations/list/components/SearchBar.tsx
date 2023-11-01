"use client";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { store } from "@/store/store";

export default function SearchBar() {
  const { reservationsSearch, setReservationsSearch } = store();
  return (
    <TextField
      variant="outlined"
      label="Hledat rezervace"
      value={reservationsSearch}
      onChange={(e) => setReservationsSearch(e.target.value)}
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
