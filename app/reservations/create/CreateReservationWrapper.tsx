"use client";
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
export default function CreateReservationWrapper({
  groups,
  users,
}: {
  groups: Group[];
  users: User[];
}) {
  return (
    <form className="flex flex-col">
      <div className="flex justify-between mb-2 items-center">
        <Typography variant="h4">Nová rezervace</Typography>
        <Button variant="outlined" type="submit">
          Uložit
        </Button>
      </div>
      <Accordion>
        <AccordionSummary expandIcon={<CheckCircleIcon color="success" />}>
          <div className="flex gap-5 items-center">
            <Typography variant="h6">Termín rezervace</Typography>
            <Typography>15. 6. 2002 - 15. 6. 2002</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div className="flex gap-5 items-center">
            <Typography variant="h6">Účastníci rezervace</Typography>
            <Typography>20 účastníků</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div className="flex gap-5 items-center">
            <Typography variant="h6">Ubytování</Typography>
            <Typography>5 pokojů</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </form>
  );
}
