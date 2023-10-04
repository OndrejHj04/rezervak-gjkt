import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
}

export const verifyAccount: React.FC<Readonly<EmailTemplateProps>> = () => (
  <div>
    <p>
      Dobrý den, váš účet na rezervačním systému pro školní chatu byl úspěšně
      schválen.
    </p>
    <p>Loučí se, admin</p>
  </div>
);
