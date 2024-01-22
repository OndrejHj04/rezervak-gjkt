"use client";
import { Button } from "@mui/material";
import { Controller, FormProvider, useForm } from "react-hook-form";
import MailingAccordion from "./MailingAccordion";

export default function MailingEvents({ events }: { events: any }) {
  const methods = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Button type="submit">Uložit</Button>
        {events.map((event: any) => (
          <MailingAccordion event={event} key={event.id} />
        ))}
      </form>
    </FormProvider>
  );
}
