import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Slider,
  Switch,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { store } from "@/store/store";

const roomsPlan = [
  { id: 1, people: 4, name: "first_room" },
  { id: 2, people: 2, name: "second_room" },
  { id: 3, people: 4, name: "third_room" },
  { id: 4, people: 4, name: "fourth_room" },
  { id: 5, people: 6, name: "fifth_room" },
];

const defaultState = {
  first_room: false,
  second_room: false,
  third_room: false,
  fourth_room: false,
  fifth_room: false,
};

export default function ReservationRoomsRender() {
  const { createReservation, setCreateReservation } = store();
  const [expanded, setExpanded] = useState(false);
  const [state, setState] = useState(defaultState);

  const calculateBeds = roomsPlan.reduce(
    (a: any, b: any) => (state[b.name as never] ? a + b.people : a + 0),
    0
  );

  const isValid = createReservation.rooms.length;
  const formValidation =
    calculateBeds && calculateBeds >= createReservation.members.length;

  const handleSubmit = () => {
    setCreateReservation({
      ...createReservation,
      rooms: roomsPlan
        .filter((item: any) => state[item.name as never])
        .map(({ id }) => id),
    });
    setExpanded(false);
  };

  const handleChange = (event: any) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
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
          {!!createReservation.rooms.length && (
            <Typography>{createReservation.rooms.length} Pokojů</Typography>
          )}
        </div>
      </AccordionSummary>
      <AccordionDetails className="flex gap-5">
        <FormControl component="fieldset" variant="standard">
          <FormGroup>
            {roomsPlan.map((check: any) => (
              <FormControlLabel
                key={check}
                control={
                  <Checkbox
                    checked={state[check.name as never]}
                    onChange={handleChange}
                    name={check.name}
                  />
                }
                label={`${check.id}. pokoj, ${check.people} lůžkový`}
              />
            ))}
          </FormGroup>

          {formValidation ? (
            <Typography variant="caption" sx={{ color: "#66bb6a" }}>
              vybráno {calculateBeds} lůžek
            </Typography>
          ) : (
            <Typography variant="caption" color="error">
              vybráno {calculateBeds} lůžek
            </Typography>
          )}
        </FormControl>
        <div className="flex flex-col gap-2">
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!calculateBeds}
          >
            Uložit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setState(defaultState);
              setCreateReservation({
                ...createReservation,
                rooms: [],
              });
            }}
            disabled={!isValid}
          >
            Smazat
          </Button>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
