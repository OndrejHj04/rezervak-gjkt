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
  Typography,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function EventsAccordion({
  event,
  options,
}: {
  event: any;
  options: any;
}) {
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
            <Controller
              {...register(`Checkbox ${singleEvent.id}`)}
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  control={<Checkbox checked={value} />}
                  onChange={(e, value) => onChange(value)}
                  label="Aktivní"
                />
              )}
            />
            <Controller
              {...register(`Select ${singleEvent.id}`)}
              control={control}
              render={({ field: { value, onChange } }) => {
                return (
                  <Autocomplete
                    value={value}
                    onChange={(_, value) => {
                      onChange(value);
                    }}
                    options={options}
                    renderOption={(props: any, option: any) => (
                      <div {...props}>
                        <Typography>{option.name}</Typography>
                      </div>
                    )}
                    getOptionLabel={(option: any) => `${option.name}`}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Šablona" />
                    )}
                  />
                );
              }}
            />
          </ListItem>
        ))}
      </AccordionDetails>
    </Accordion>
  );
}
