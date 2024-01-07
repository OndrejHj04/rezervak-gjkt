export default function ResetPasswordTemplate({
  email,
  password,
}: {
  email: any;
  password: any;
}) {
  return `Vaše přihlašovací údaje pro aplikaci rezervačního sytému školní chaty jsou:
  <ul>
    <li>email: ${email}</li>
    <li>heslo: ${password}</li>
  </ul>
  `;
}
