import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
}

export const publicSendPassword: React.FC<
  Readonly<EmailTemplateProps>
> = () => (
  <div>
    <p>Zdravím a posíláme klíčenku</p>
  </div>
);
