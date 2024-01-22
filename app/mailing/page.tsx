import { Tab, Tabs } from "@mui/material";
import Link from "next/link";
import MailingEvents from "./MailingEvents";
import MailingTemplates from "./MailingTemplates";
import fetcher from "@/lib/fetcher";

const getEvents = async () => {
  const { data } = await fetcher("/api/mailing/events/list");
  return data;
};

export default async function Mailing({
  searchParams: { mode },
}: {
  searchParams: { mode: any };
}) {
  const events = await getEvents();
  return (
    <div>
      <Tabs value={mode === "events" ? 1 : 0} aria-label="basic tabs example">
        <Tab
          label="Šablony"
          component={Link}
          href={`/mailing?mode=templates`}
        />
        <Tab label="Události" component={Link} href={`/mailing?mode=events`} />
      </Tabs>
      {mode === "events" ? (
        <MailingEvents events={events} />
      ) : (
        <MailingTemplates />
      )}
    </div>
  );
}
