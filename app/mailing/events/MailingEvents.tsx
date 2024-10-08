import { mailingEventsList, mailingTemplateEdit, malingTemplatesList } from "@/lib/api";
import MailingEventsForm from "./MailingEventsForm";

export default async function MailingEvents() {
  const events = await mailingEventsList()

  return <MailingEventsForm events={events} />
}
