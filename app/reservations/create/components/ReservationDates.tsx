import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
  } from "@mui/material";
  import CheckCircleIcon from "@mui/icons-material/CheckCircle";
  import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function ReservationDates() {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div className="flex gap-5 items-center">
          <Typography variant="h6">Termín rezervace</Typography>
          <Typography>17. 6. 2020 - 14. 8. 2021</Typography>
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
