"use client";
import { Button, Paper, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import EventsAccordion from "./EventsAccordion";
import { toast } from "react-toastify";
import { mailingEventsEdit } from "@/lib/api";

export default function MailingEvents({ events }: { events: any }) {
  const defaultValues = events
    .reduce((acc: any, event: any) => acc.concat(event.children), [])
    .reduce((obj: any, item: any, i: any) => {
      obj[`Checkbox ${item.id}`] = item.active;
      return obj;
    }, {});

  const methods = useForm({ defaultValues });

  const onSubmit = (data: any) => {
    console.log(data)
    mailingEventsEdit({ data }).then(() => {
      toast.success("Události úspěšně upraveny");
      methods.reset(data);
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Paper className="flex flex-col">
          <div className="flex justify-between p-2">
            <Typography variant="h5">
              Nastavení emailů pro jednotlivé události
            </Typography>
            <Button
              variant="outlined"
              type="submit"
              disabled={!methods.formState.isDirty}
            >
              Uložit
            </Button>
          </div>
          <EventsAccordion events={events} />
        </Paper>
      </form>
    </FormProvider>
  );
}
