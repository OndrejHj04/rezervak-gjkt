"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

export default function ReservationMembersRender() {
  const [expanded, setExpanded] = useState(false);
  const isValid = true;
  return (
    <Accordion expanded={expanded} onClick={() => setExpanded((c) => !c)}>
      <AccordionSummary
        expandIcon={
          isValid && !expanded ? (
            <CheckCircleIcon color="success" />
          ) : (
            <ExpandMoreIcon />
          )
        }
      >
        <div className="flex gap-5 items-center">
          <Typography variant="h6">Účastníci rezervace</Typography>
          <Typography>15 účastníků</Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}
