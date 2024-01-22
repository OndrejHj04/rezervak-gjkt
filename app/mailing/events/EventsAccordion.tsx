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
import { useEffect } from "react";
import _ from "lodash";

export default function EventsAccordion({
  events,
  options,
}: {
  events: any;
  options: any;
}) {
  const {
    control,
    register,
    watch,
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      {events.map((event: any) => (
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
                  render={({ field: { value, onChange } }) => {
                    return (
                      <FormControlLabel
                        control={<Checkbox checked={value} />}
                        onChange={(e, value) => {
                          onChange(value);
                          if (!value) {
                            watch(`Select ${singleEvent.id}`) &&
                              setValue(`Select ${singleEvent.id}`, null);
                          } else {
                            !watch(`Select ${singleEvent.id}`) &&
                              setError(`Select ${singleEvent.id}`, {
                                type: "custom",
                                message:
                                  "Aktivní události musí mít přiřazenou šablonu",
                              });
                          }
                        }}
                        label="Aktivní"
                      />
                    );
                  }}
                />
                <Controller
                  {...register(`Select ${singleEvent.id}`)}
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    const error = errors[`Select ${singleEvent.id}`];
                    return (
                      <Autocomplete
                        value={value}
                        onChange={(_, value) => {
                          if (errors[`Select ${singleEvent.id}`]) {
                            clearErrors(`Select ${singleEvent.id}`);
                          }

                          onChange(value);
                        }}
                        options={options}
                        disabled={!watch(`Checkbox ${singleEvent.id}`)}
                        renderOption={(props: any, option: any) => (
                          <div {...props}>
                            <Typography>{option.name}</Typography>
                          </div>
                        )}
                        getOptionLabel={(option: any) => `${option.name}`}
                        sx={{ width: 300 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Šablona"
                            error={Boolean(error)}
                            helperText={
                              Boolean(error) && (error?.message as any)
                            }
                          />
                        )}
                      />
                    );
                  }}
                />
              </ListItem>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
