"use client";

import { store } from "@/store/store";
import { Button, TextField, Typography } from "@mui/material";

export default function FusionForm() {
  const { fusion, setFusion, setFusionData, fusionData } = store();
  const [firstRow, secondRow] = fusion;

  const handleCreateFuse = () => {
    setFusion([])
    setFusionData([...fusionData, [firstRow, secondRow]]);
  };

  return (
    <div className="p-1 flex flex-col justify-start gap-2">
      <Typography className="text-xl">Fúze řádků</Typography>
      <TextField
        label="První řádek"
        value={firstRow?.name || ""}
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
      />
      <TextField
        label="Druhý řádek"
        value={secondRow?.name || ""}
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
      />
      <Button onClick={handleCreateFuse}>Vytvořit fúzi</Button>
    </div>
  );
}
