export default function NewUserTemplate(email: any, password: any) {
  return `
  V aplikaci ${process.env.NEXT_PUBLIC_API_URL} Vám byl vytvořen účet s následujícími přihlašovacími údaji.<br/>
  email: ${email}<br />
  heslo: ${password}<br />
  Po přihlášení do aplikace bude nutné ověřit účet. Budete vyzváni ke změně hesla a vyplnění čísla OP, data narození a adresy.
  `;
}
