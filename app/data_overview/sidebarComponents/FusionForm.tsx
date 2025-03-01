"use client";

import { store } from "@/store/store";
import { Button, TextField, Typography } from "@mui/material";

export default function FusionForm() {
  const { fusion, setFusion, setFusionData, fusionData } = store();
  const [firstRow, secondRow] = fusion;
  const inputValue = [firstRow?.name, secondRow?.name].toString();
  console.log(inputValue);
  const handleCreateFuse = () => {
    setFusion([]);
    setFusionData([...fusionData, [firstRow, secondRow]]);
  };

  return (
    <div className="flex flex-col justify-start gap-2">
      <Typography className="text-xl text-center">Fúze řádků</Typography>
      <TextField
        size="small"
        label="Řádky"
        value={firstRow || secondRow ? inputValue : " "}
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
      />
      <Button
        onClick={handleCreateFuse}
        variant="outlined"
        size="small"
        disabled={!(firstRow && secondRow)}
      >
        Vytvořit fúzi
      </Button>
    </div>
  );
}
