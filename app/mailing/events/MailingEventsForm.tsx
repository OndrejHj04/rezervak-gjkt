"use client";
import { Accordion, AccordionDetails, AccordionSummary, Button, FormControlLabel, ListItem, ListItemText, Paper, Switch, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { mailingEventsEdit } from "@/lib/api";
import Link from "next/link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function MailingEvents({ events }: { events: any }) {
  const defaultValues = events
    .reduce((acc: any, event: any) => acc.concat(event.children), [])
    .reduce((obj: any, item: any) => {
      obj[`Checkbox ${item.id}`] = Boolean(item.active);
      return obj;
    }, {});

  const { reset, control, watch, register, handleSubmit, formState: { isDirty } } = useForm({ defaultValues });

  console.log(watch())
  const onSubmit = (data: any) => {
    mailingEventsEdit({ data }).then(() => {
      toast.success("Události úspěšně upraveny");
      reset(data);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Paper className="flex flex-col">
        <div className="flex justify-between p-2">
          <Typography variant="h5">
            Nastavení emailů pro jednotlivé události
          </Typography>
          <Button
            variant="outlined"
            type="submit"
            size="small"
            disabled={!isDirty}
          >
            Uložit
          </Button>
        </div>
        {events.map((event: any) => (
          <Accordion key={event.name}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {event.name}
            </AccordionSummary>

            <AccordionDetails>
              {event.children.map((singleEvent: any) => (
                <ListItem
                  key={singleEvent.id}
                  className="flex justify-between"
                  sx={{ justifyContent: "space-between !important" }}
                >
                  <ListItemText
                    primary={singleEvent.primary_txt}
                    secondary={singleEvent.secondary_txt}
                  />
                  <div className="flex">
                    <Controller
                      {...register(`Checkbox ${singleEvent.id}`)}
                      control={control}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <FormControlLabel
                            control={<Switch checked={value} />}
                            onChange={(_, value) => {
                              onChange(value);
                            }}
                            label="Aktivní"
                          />
                        );
                      }}
                    />
                    <Button component={Link} href={`/mailing/templates/detail/${singleEvent.template.id}`}>Detail</Button>
                  </div>
                </ListItem>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </form>
  );
}
