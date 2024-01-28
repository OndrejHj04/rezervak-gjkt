"use server";
import { Button, Tab, Tabs } from "@mui/material";
import Link from "next/link";
import MailingEvents from "./events/MailingEvents";
import MailingTemplates from "./templates/MailingTemplates";
import fetcher from "@/lib/fetcher";

const getEvents = async () => {
  const { data } = await fetcher("/api/mailing/events/list");
  return data;
};

const getTemplates = async () => {
  const { data } = await fetcher("/api/mailing/templates/list");
  return data;
};

export default async function Mailing({
  searchParams: { mode },
}: {
  searchParams: { mode: any };
}) {
  const events = await getEvents();
  const templates = await getTemplates();

  return (
    <div>
      <div className="flex justify-between items">
        <Tabs value={mode === "events" ? 1 : 0} aria-label="basic tabs example">
          <Tab
            label="Šablony"
            component={Link}
            href={`/mailing?mode=templates`}
          />
          <Tab
            label="Události"
            component={Link}
            href={`/mailing?mode=events`}
          />
        </Tabs>
      </div>
      {mode === "events" ? (
        <MailingEvents events={events} options={templates} />
      ) : (
        <MailingTemplates templates={templates} />
      )}
    </div>
  );
}
