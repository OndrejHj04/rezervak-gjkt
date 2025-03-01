"use client";
import { store } from "@/store/store";
import { Button } from "@mui/material";

export function ResetFiltersButton({ className }: any) {
  const { setFusionData, setFusion } = store();
  const setDetaultSettings = () => {
    setFusionData([]);
    setFusion([]);
  };

  return (
    <Button className={className} color="error" onClick={setDetaultSettings}>
      Obnovit základní nastavení
    </Button>
  );
}
