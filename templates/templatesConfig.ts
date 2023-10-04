import { publicSendPassword } from "./store/publicSendPassword";
import { verifyAccount } from "./store/verifyAccount";

const templatesConfig = [
  { template: verifyAccount, name: "verify-account", subject: "Ověřit účet" },
  {
    template: publicSendPassword,
    name: "public-send-password",
    subject: "Odeslaní hesla",
  },
];

export const templates = (name: string) => {
  const template = templatesConfig.find((template) => template.name === name);

  return template;
};
