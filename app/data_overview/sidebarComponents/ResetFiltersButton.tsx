"use client";
import { store } from "@/store/store";
import { Button } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function ResetFiltersButton({ className }: any) {
  const { setFusionData, setFusion, fusionData } = store();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const setDetaultSettings = () => {
    replace(`${pathname}`);
    setFusionData([]);
    setFusion([]);
  };

  const isValid = searchParams.size || fusionData.length;

  return (
    <Button
      className={className}
      color="error"
      onClick={setDetaultSettings}
      size="small"
      disabled={!isValid}
    >
      Obnovit základní nastavení
    </Button>
  );
}
