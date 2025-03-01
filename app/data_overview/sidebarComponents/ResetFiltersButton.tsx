"use client";
import { store } from "@/store/store";
import { Button } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";

export function ResetFiltersButton({ className }: any) {
  const { setFusionData, setFusion } = store();
  const pathname = usePathname();
  const { replace } = useRouter();

  const setDetaultSettings = () => {
    replace(`${pathname}`);
    setFusionData([]);
    setFusion([]);
  };

  return (
    <Button
      className={className}
      color="error"
      onClick={setDetaultSettings}
      size="small"
    >
      Obnovit základní nastavení
    </Button>
  );
}
