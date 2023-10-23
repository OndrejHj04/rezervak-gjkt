"use client";

import { store } from "@/store/store";
import { Button } from "@mui/material";
import * as _ from "lodash";

export default function CreateButton() {
  const { createReservation } = store();

  const handleSubmit = () => {
    console.log(createReservation);
  };

  return (
    <Button
      variant="outlined"
      type="submit"
      onClick={handleSubmit}
      disabled={_.some(createReservation, _.isEmpty)}
    >
      Uložit
    </Button>
  );
}
