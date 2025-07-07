"use client";

import { Button, TextField, Typography } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FusionContext } from "../layout";

export default function FusionForm() {
  const { fusion, setFusion, setFusionData, fusionData } = useContext(FusionContext);
  const [firstRow, secondRow] = fusion;
  const [name, setName] = useState("");
  const inputValue = [firstRow?.name, secondRow?.name].toString();

  const handleCreateFuse = () => {
    setFusion([]);
    setName("");

    const newData = [
      ...fusionData,
      { [name]: [firstRow.id, secondRow.id] },
    ] as any;

    setFusionData(newData);
    localStorage.setItem("fusion", JSON.stringify(newData))
    localStorage.setItem("fusion_timestamp", new Date().toString())
  };

  return (
    <div className="flex flex-col justify-start gap-2">
      <Typography className="text-xl text-center">Fúze řádků</Typography>
      <TextField
        size="small"
        label="Řádky"
        value={firstRow || secondRow ? inputValue : ""}
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
      />
      <TextField
        size="small"
        label="Název fúze"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button
        onClick={handleCreateFuse}
        variant="outlined"
        size="small"
        disabled={!(firstRow && secondRow && name)}
      >
        Vytvořit fúzi
      </Button>
    </div>
  );
}
