import MailingEvents from "../events/MailingEvents";
import MailingSend from "../send/MailingSend";
import MailingTemplates from "../templates/MailingTemplates"

export default function Page({ params: { type } }: any) {
  let content
  switch (type) {
    case "send":
      content = <MailingSend />
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
