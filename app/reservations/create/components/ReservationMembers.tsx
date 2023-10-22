import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function ReservationMembers() {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<CheckCircleIcon color="success" />}>
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
