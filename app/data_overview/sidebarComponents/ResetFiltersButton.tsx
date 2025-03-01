"use client";
import { store } from "@/store/store";
import { Button } from "@mui/material";

export function ResetFiltersButton({ className }: any) {
  const { fusion, setFusion } = store();
  const setDetaultSettings = () => {
    setFusion([]);
  };

  return (
    <Button className={className} color="error" onClick={setDetaultSettings}>
      Obnovit základní nastavení
    </Button>
  );
}
