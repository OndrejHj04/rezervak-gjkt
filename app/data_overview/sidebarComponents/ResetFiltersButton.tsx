"use client";
import { store } from "@/store/store";
import { Button, Typography } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

export function ResetFiltersButton({ className }: any) {
  const { setFusionData, setFusion, fusionData } = store();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const setDetaultSettings = () => {
    replace(`${pathname}`);
    setFusionData([]);
    setFusion([]);
    localStorage.removeItem("fusion")
    localStorage.removeItem("fusion_timestamp")
  };

  const isValid = searchParams.size || fusionData.length;

  return (
    <div className={`${className} flex flex-col`}>
      <Button
        color="error"
        onClick={setDetaultSettings}
        size="small"
        disabled={!isValid}
      >
        Obnovit základní nastavení
      </Button>
    </div>
  );
}
