import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  ListItem,
  ListItemText,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect } from "react";
import _ from "lodash";
import { varTranslate } from "@/lib/variablesTranslate";
import Link from "next/link";

export default function EventsAccordion({ events }: { events: any }) {
  const { control, register } = useFormContext();

  return (
    <>
      {events.map((event: any) => (
        <Accordion key={event.name}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {event.name}
          </AccordionSummary>

          <AccordionDetails>
            <Box sx={{ overflow: "auto" }}>
              <Box
                sx={{ width: "100%", display: "table", tableLayout: "fixed" }}
              >
                {event.children.map((singleEvent: any) => (
                  <ListItem
                    key={singleEvent.id}
                    className="flex justify-between"
                  >
                    <div className="flex flex-col">
                      <ListItemText
                        primary={singleEvent.primary_txt}
                        secondary={singleEvent.secondary_txt}
                      />
                      <div className="flex gap-2 items-center">
                        <Typography>Proměnné: </Typography>
                        {singleEvent.variables.map((item: any, i: any) => (
                          <Chip key={i} label={varTranslate[item as never]} />
                        ))}
                      </div>
                    </div>
                    <div className="flex">
                      <Controller
                        {...register(`Checkbox ${singleEvent.id}`)}
                        control={control}
                        render={({ field: { value, onChange } }) => {
                          return (
                            <FormControlLabel
                              control={<Switch checked={value} />}
                              onChange={(e, value) => {
                                onChange(value);
                              }}
                              label="Aktivní"
                            />
                          );
                        }}
                      />
                      <Link
                        href={`/mailing/templates/detail/${singleEvent.template.id}`}
                      >
                        <Button>Detail</Button>
                      </Link>
                    </div>
                  </ListItem>
                ))}
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
