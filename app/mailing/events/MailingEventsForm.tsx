"use client";
import { Accordion, AccordionDetails, AccordionSummary, Button, FormControlLabel, ListItem, ListItemText, Paper, Switch, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { mailingEventsEdit } from "@/lib/api";
import Link from "next/link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function MailingEvents({ events }: { events: any }) {
  const defaultValues = events.reduce((obj: any, item: any) => {
    obj[`Checkbox ${item.id}`] = Boolean(item.active)
    return obj
  }, {})
  const { reset, control, watch, register, handleSubmit, formState: { isDirty } } = useForm({ defaultValues });

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
          <ListItem
            key={event.id}
            className="flex justify-between"
            sx={{ justifyContent: "space-between !important" }}
          >
            <ListItemText
              primary={event.primary_txt}
              secondary={event.secondary_txt}
            />
            <div className="flex">
              <Controller
                {...register(`Checkbox ${event.id}`)}
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
              <Button component={Link} href={`/mailing/templates/detail/${event.template}`}>Detail</Button>
            </div>
          </ListItem>))}
      </Paper>
    </form>
  );
}
