import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function MailingAccordion({ event }: { event: any }) {
  const { control, register } = useFormContext();
  return (
    <Accordion key={event.name}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        {event.name}
      </AccordionSummary>

      <AccordionDetails>
        {event.children.map((singleEvent: any) => (
          <ListItem key={singleEvent.id}>
            <ListItemText
              primary={singleEvent.primary_txt}
              secondary={singleEvent.secondary_txt}
            />
            <FormControlLabel
              control={<Checkbox {...register(`Checkbox ${singleEvent.id}`)} />}
              label="Aktivní"
            />
            <Controller
              name={`Select ${singleEvent.id}`}
              control={control}
              render={() => (
                <Autocomplete
                  options={[]}
                  disabled={singleEvent.template === null}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Šablona" />
                  )}
                />
              )}
            />
          </ListItem>
        ))}
      </AccordionDetails>
    </Accordion>
  );
}
