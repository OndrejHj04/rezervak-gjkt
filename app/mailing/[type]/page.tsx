import MailingEvents from "../events/MailingEvents";
import MailingSend from "../send/MailingSend";
import MailingTemplates from "../templates/MailingTemplates"

export default function Page({ params: { type }, searchParams: { page } }: any) {
  let content
  switch (type) {
    case "send":
      content = <MailingSend page={page} />
      break;
    case "templates":
      content = <MailingTemplates />
      break;
    case "events":
      content = <MailingEvents />
      break;
  }

  return content
}
