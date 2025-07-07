"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useContext, useState } from "react";
import { ReservationContext } from "../../layout";
export default function ReservationMembersRender({
  groups,
  family
}: {
  groups: any;
  family: any
}) {
  const { setCreateReservation, createReservation } = useContext(ReservationContext);
  const [expanded, setExpanded] = useState(false);
  const isValid = createReservation.groups.length || createReservation.family;
  const [selectedGroups, setSelectedGroups] = useState<any>([])
  const [checkFamily, setCheckFamily] = useState(false)

  const makeReset = () => {
    setSelectedGroups([]);
    setCheckFamily(false)
    setCreateReservation({
      ...createReservation,
      groups: [],
      family: false
    });
  };

  const handleSubmit = () => {
    setCreateReservation({
      ...createReservation,
      groups: selectedGroups,
      family: checkFamily
    });
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
        <Typography variant="h6">Skupiny a rodina</Typography>
      </AccordionSummary>
      <AccordionDetails className="p-2">
        <Typography variant="h5">Přidejte vaše skupiny nebo rodinu do rezervace</Typography>
        <Typography>Všichni budou automaticky přidání do rezervace jako účastníci. Další účastníky budete moci přidat po vytvoření rezervace. Tato akce není povinná.</Typography>

        <div className="flex flex-col mt-2">
          <FormControl className="w-[300px]">
            <InputLabel id="demo-simple-select-label">Skupiny</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              multiple
              value={selectedGroups}
              disabled={!groups.length}
              label="Skupiny"
              onChange={(e) => setSelectedGroups(e.target.value)}
            >
              {groups.map((group: any) => (
                <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel disabled={!family.length} onChange={(e: any) => setCheckFamily(e.target.checked)} checked={checkFamily} control={<Checkbox />} label="Přidat celou rodinu" />
          <div>
            <Button variant="contained" disabled={isValid} onClick={handleSubmit}>Uložit</Button>
            <Button variant="contained" color="error" className="ml-2" onClick={makeReset} disabled={!isValid}>Zrušit</Button>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
