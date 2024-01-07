export default function GroupUsersEdit(group: any, type: "add" | "remove") {
  return `
  V aplikace rezervačního systému školní chaty byl Váš účet ${type === "add" ? "<b>přidán</b> do" : "<b>odebrán</b> ze"} skupiny ${group.name}.<br/>
  Majitelem této skupiny je: ${group.owner.first_name} ${group.owner.last_name}, ${group.owner.email}.<br/>
  Pokud si myslíte, že jde o chybu, obraťte se prosím na majitele skupiny.
  `;
}
