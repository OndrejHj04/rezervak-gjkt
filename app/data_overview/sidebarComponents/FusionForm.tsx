"use client";

import { store } from "@/store/store";
import { Button, TextField, Typography } from "@mui/material";

export default function FusionForm() {
  const { fusion, setFusion, setFusionData, fusionData } = store();
  const [firstRow, secondRow] = fusion;

  const handleCreateFuse = () => {
    setFusion([]);
    setFusionData([...fusionData, [firstRow, secondRow]]);
  };

  return (
    <div className="flex flex-col justify-start gap-2">
      <Typography className="text-xl text-center">Fúze řádků</Typography>
      <TextField
        size="small"
        label="První řádek"
        value={firstRow?.name || ""}
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
      />
      <TextField
        size="small"
        label="Druhý řádek"
        value={secondRow?.name || ""}
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
      />
      <Button onClick={handleCreateFuse} variant="outlined" size="small">
        Vytvořit fúzi
      </Button>
    </div>
  );
}
