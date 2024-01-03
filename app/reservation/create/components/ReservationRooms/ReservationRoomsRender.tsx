import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControlLabel,
  Slider,
  Switch,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { store } from "@/store/store";

export default function ReservationRoomsRender() {
  const { createReservation, setCreateReservation } = store();
  const [expanded, setExpanded] = useState(false);
  const [roomsCount, setRoomsCount] = useState(6);
  const isValid = createReservation.rooms;

  const handleSubmit = () => {
    setCreateReservation({ ...createReservation, rooms: roomsCount });
    setExpanded(false);
  };

  return (
    <Accordion expanded={expanded}>
      <AccordionSummary
        onClick={() => setExpanded((c) => !c)}
        expandIcon={
          isValid && !expanded ? (
            <CheckCircleIcon color="success" />
          ) : (
            <ExpandMoreIcon />
          )
        }
      >
        <div className="flex gap-5 items-center">
          <Typography variant="h6">Ubytování</Typography>
          {!!createReservation.rooms && (
            <Typography>{createReservation.rooms} Pokojů</Typography>
          )}
        </div>
      </AccordionSummary>
      <AccordionDetails className="flex gap-5">
        <div className="flex flex-col">
          <Slider
            sx={{ width: 200 }}
            valueLabelDisplay="on"
            min={1}
            marks
            max={6}
            value={roomsCount}
            onChange={(e: any) => setRoomsCount(e.target.value)}
          />
          <FormControlLabel
            control={
              <Switch
                checked={roomsCount === 6}
                onClick={() => setRoomsCount((c) => (c === 6 ? 1 : 6))}
              />
            }
            label="Celá chata"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="contained" onClick={handleSubmit}>
            Uložit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setRoomsCount(6);
              setCreateReservation({ ...createReservation, rooms: 0 });
            }}
          >
            Smazat
          </Button>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
