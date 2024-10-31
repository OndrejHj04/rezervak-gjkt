"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { store } from "@/store/store";
export default function ReservationMembersRender({
  groups,
}: {
  groups: any;
}) {
  const { setCreateReservation, createReservation } = store();
  const [expanded, setExpanded] = useState(false);
  const isValid = createReservation.groups.length;
  const [selectedGroups, setSelectedGroups] = useState<any>([])

  const makeReset = () => {
    setSelectedGroups([]);
    setCreateReservation({
      ...createReservation,
      members: [],
      groups: [],
    });
  };

  const handleSubmit = () => {
    setCreateReservation({
      ...createReservation,
      groups: selectedGroups,
    });
    setExpanded(false);
  };

  const handleSelect = (id: any) => {
    if (selectedGroups.includes(id)) {
      setSelectedGroups((s: any) => s.filter((i: any) => i !== id))
    } else {
      setSelectedGroups((s: any) => ([...s, id]))
    }
  }

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
        <Typography variant="h6">Skupiny v rezervaci</Typography>
      </AccordionSummary>
      <AccordionDetails className="p-2">
        <Typography variant="h5">Přidejte vaše skupiny do rezervace</Typography>
        <Typography>Všichni členové skupiny budou automaticky přidání do rezervace. Další uživatele budete moci přidat po vytvoření. Tato akce není povinná.</Typography>
        <List className="w-[240px]">
          {groups.length > 0 ? groups.map((group: any) => (
            <ListItemButton className="!p-1" key={group.id} onClick={() => handleSelect(group.id)} selected={selectedGroups.includes(group.id)}>
              <ListItemText primary={group.name} secondary={`${group.users_count} členů`} />
            </ListItemButton>
          )) : <Typography className="p-4">Nemáte vytvořené žádné skupiny!</Typography>}
        </List>
        <Button variant="contained" disabled={!selectedGroups.length || isValid} onClick={handleSubmit}>Uložit</Button>
        <Button variant="contained" color="error" className="ml-2" onClick={makeReset} disabled={!isValid}>Zrušit</Button>
      </AccordionDetails>
    </Accordion>
  );
}
