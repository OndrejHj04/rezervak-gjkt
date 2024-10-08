import { Tab, Tabs } from "@mui/material";
import MailingEvents from "../events/MailingEvents";
import MailingTemplates from "../templates/MailingTemplates";
import Link from "next/link";
import { mailingEventsList, malingTemplatesList } from "@/lib/api";

enum navigation {
  "send", "templates", "events"
}

export default async function Layout({
  params, children
}: any) {
  const { type } = params
  const events = await mailingEventsList();
  const templates = await malingTemplatesList();

  return (
    <div>
      <div className="flex justify-between items">
        <Tabs value={navigation[type]} aria-label="basic tabs example">
          <Tab
            label="Odesláno"
            component={Link}
            href="/mailing/send"
          />
          <Tab
            label="Šablony"
            component={Link}
            href="/mailing/templates"
          />
          <Tab
            label="Události"
            component={Link}
            href="/mailing/events"
          />
        </Tabs>
      </div>
      {children}
    </div>
  );
}
