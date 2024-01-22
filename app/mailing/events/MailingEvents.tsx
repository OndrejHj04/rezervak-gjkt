"use client";
import { Button } from "@mui/material";
import { Controller, FormProvider, useForm } from "react-hook-form";
import EventsAccordion from "./EventsAccordion";
import fetcher from "@/lib/fetcher";
import { toast } from "react-toastify";

export default function MailingEvents({
  events,
  options,
}: {
  events: any;
  options: any;
}) {
  const defaultValues = events
    .reduce((acc: any, event: any) => acc.concat(event.children), [])
    .reduce(
      (acc: any, item: any) => ({
        ...acc,
        [`Checkbox ${item.id}`]: Boolean(item.active),
        [`Select ${item.id}`]: item.template,
      }),
      {}
    );

  const methods = useForm({ defaultValues });

  const onSubmit = (data: any) => {
    fetcher(`/api/mailing/events/edit`, {
      method: "POST",
      body: JSON.stringify(data),
    }).then(() => {
      toast.success("Události úspěšně upraveny");
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Button type="submit">Uložit</Button>
        {events.map((event: any) => (
          <EventsAccordion event={event} key={event.id} options={options} />
        ))}
      </form>
    </FormProvider>
  );
}
