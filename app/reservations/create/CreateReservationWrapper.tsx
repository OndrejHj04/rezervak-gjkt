import { Group } from "@/types";
import { User } from "next-auth";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReservationMembers from "./components/ReservationMembers";
import ReservationDates from "./components/ReservationDates/ReservationDates";
import ReservationRooms from "./components/ReservationRooms";
export default function CreateReservationWrapper({
  groups,
  users,
}: {
  groups: Group[];
  users: User[];
}) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between mb-2 items-center">
        <Typography variant="h4">Nová rezervace</Typography>
        <Button variant="outlined" type="submit">
          Uložit
        </Button>
      </div>
      <ReservationDates />
    </div>
  );
}
