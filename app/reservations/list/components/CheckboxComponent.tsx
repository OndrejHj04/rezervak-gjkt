import { Reservation } from "@/types";
import { Checkbox } from "@mui/material";

export default function CheckboxComponent({
  reservations,
}: {
  reservations: Reservation[];
}) {
  return <Checkbox />;
}
