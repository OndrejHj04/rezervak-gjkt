"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  ListItem,
  ListItemText,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function MailingEvents({ events }: { events: any }) {
  return (
    <div>
      {events.map((event: any) => (
        <Accordion key={event.name}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {event.name}
          </AccordionSummary>

          <AccordionDetails>
            {event.children.map((singleEvent: any) => (
              <ListItem key={singleEvent.id} className="">
                <ListItemText
                  primary={singleEvent.primary_txt}
                  secondary={singleEvent.secondary_txt}
                />
                <FormControlLabel
                  control={<Checkbox checked={singleEvent.template !== null} />}
                  label="Aktivní"
                />
                <Autocomplete
                  options={[]}
                  disabled={singleEvent.template === null}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Šablona" />
                  )}
                />
              </ListItem>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
