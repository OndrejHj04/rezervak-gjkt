"use client";

import { Button } from "@mui/material";
import { useFormContext } from "react-hook-form";

export default function SubmitButton() {
  const methods = useFormContext();
  const handleSubmit = () => {};

  return (
    <Button
      variant="outlined"
      type="submit"
      size="small"
      onClick={handleSubmit}
    >
      Uložit
    </Button>
  );
}
